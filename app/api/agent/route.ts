import { NextRequest, NextResponse } from 'next/server'
import parseLLMJson from '@/lib/jsonParser'

const LYZR_API_URL = 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/'
const LYZR_API_KEY = process.env.LYZR_API_KEY || ''

// Validate environment on module load
if (!LYZR_API_KEY && typeof window === 'undefined') {
  console.error('[API Route] WARNING: LYZR_API_KEY is not configured!')
}

console.log('[API Route] /api/agent module loaded successfully')

// Types
interface NormalizedAgentResponse {
  status: 'success' | 'error'
  result: Record<string, any>
  message?: string
  metadata?: {
    agent_name?: string
    timestamp?: string
    [key: string]: any
  }
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function normalizeResponse(parsed: any): NormalizedAgentResponse {
  if (!parsed) {
    return {
      status: 'error',
      result: {},
      message: 'Empty response from agent',
    }
  }

  if (typeof parsed === 'string') {
    return {
      status: 'success',
      result: { text: parsed },
      message: parsed,
    }
  }

  if (typeof parsed !== 'object') {
    return {
      status: 'success',
      result: { value: parsed },
      message: String(parsed),
    }
  }

  if ('status' in parsed && 'result' in parsed) {
    return {
      status: parsed.status === 'error' ? 'error' : 'success',
      result: parsed.result || {},
      message: parsed.message,
      metadata: parsed.metadata,
    }
  }

  if ('status' in parsed) {
    const { status, message, metadata, ...rest } = parsed
    return {
      status: status === 'error' ? 'error' : 'success',
      result: Object.keys(rest).length > 0 ? rest : {},
      message,
      metadata,
    }
  }

  if ('result' in parsed) {
    return {
      status: 'success',
      result: parsed.result,
      message: parsed.message,
      metadata: parsed.metadata,
    }
  }

  if ('message' in parsed && typeof parsed.message === 'string') {
    return {
      status: 'success',
      result: { text: parsed.message },
      message: parsed.message,
    }
  }

  if ('response' in parsed) {
    return normalizeResponse(parsed.response)
  }

  return {
    status: 'success',
    result: parsed,
    message: undefined,
    metadata: undefined,
  }
}

export async function POST(request: NextRequest) {
  // Top-level safety wrapper to ALWAYS return JSON, never HTML
  try {
    console.log('[API Route] POST /api/agent called')

    let body: any
    try {
      body = await request.json()
    } catch (jsonError) {
      console.error('[API Route] Failed to parse request body:', jsonError)
      return NextResponse.json(
        {
          success: false,
          response: {
            status: 'error',
            result: {},
            message: 'Invalid JSON in request body',
          },
          error: 'Invalid JSON in request body',
        },
        { status: 400 }
      )
    }

    const { message, agent_id, user_id, session_id, assets } = body

    if (!message || !agent_id) {
      return NextResponse.json(
        {
          success: false,
          response: {
            status: 'error',
            result: {},
            message: 'message and agent_id are required',
          },
          error: 'message and agent_id are required',
        },
        { status: 400 }
      )
    }

    if (!LYZR_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          response: {
            status: 'error',
            result: {},
            message: 'LYZR_API_KEY not configured',
          },
          error: 'LYZR_API_KEY not configured on server',
        },
        { status: 500 }
      )
    }

    const finalUserId = user_id || `user-${generateUUID()}`
    const finalSessionId = session_id || `${agent_id}-${generateUUID().substring(0, 12)}`

    const payload: Record<string, any> = {
      message,
      agent_id,
      user_id: finalUserId,
      session_id: finalSessionId,
    }

    if (assets && assets.length > 0) {
      payload.assets = assets
    }

    const response = await fetch(LYZR_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': LYZR_API_KEY,
      },
      body: JSON.stringify(payload),
    })

    const rawText = await response.text()

    if (response.ok) {
      try {
        const parsed = parseLLMJson(rawText)

        // Check if parser returned an error object
        if (!parsed || (typeof parsed === 'object' && parsed.success === false)) {
          const errorMessage = parsed?.error || 'Failed to parse agent response. The agent may have returned invalid JSON.'
          return NextResponse.json({
            success: false,
            response: {
              status: 'error',
              result: {},
              message: errorMessage,
            },
            error: errorMessage,
            raw_response: rawText.substring(0, 1000),
          })
        }

        // Check if the parsed result itself indicates an error
        if (parsed?.success === false && parsed?.error) {
          return NextResponse.json({
            success: false,
            response: {
              status: 'error',
              result: {},
              message: parsed.error,
            },
            error: parsed.error,
            raw_response: rawText,
          })
        }

        const normalized = normalizeResponse(parsed)

        return NextResponse.json({
          success: true,
          response: normalized,
          agent_id,
          user_id: finalUserId,
          session_id: finalSessionId,
          timestamp: new Date().toISOString(),
          raw_response: rawText,
        })
      } catch (parseError) {
        return NextResponse.json({
          success: false,
          response: {
            status: 'error',
            result: {},
            message: `JSON parsing error: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`,
          },
          error: 'JSON parsing failed',
          raw_response: rawText.substring(0, 500), // Include first 500 chars for debugging
          details: parseError instanceof Error ? parseError.message : 'Unknown error',
        })
      }
    } else {
      let errorMsg = `API returned status ${response.status}`
      try {
        const errorData = parseLLMJson(rawText) || JSON.parse(rawText)
        errorMsg = errorData?.error || errorData?.message || errorMsg
      } catch {}

      return NextResponse.json(
        {
          success: false,
          response: {
            status: 'error',
            result: {},
            message: errorMsg,
          },
          error: errorMsg,
          raw_response: rawText,
        },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('[API Route] Unexpected error in POST handler:', error)
    const errorMsg = error instanceof Error ? error.message : 'Server error'
    const errorStack = error instanceof Error ? error.stack : ''

    // Try NextResponse.json first, fallback to raw Response if it fails
    try {
      return NextResponse.json(
        {
          success: false,
          response: {
            status: 'error',
            result: {},
            message: errorMsg,
          },
          error: errorMsg,
          stack: process.env.NODE_ENV === 'development' ? errorStack : undefined,
        },
        { status: 500 }
      )
    } catch (catastrophicError) {
      // Absolute last resort - if even NextResponse.json fails
      console.error('[API Route] CATASTROPHIC ERROR:', catastrophicError)
      return new Response(
        JSON.stringify({
          success: false,
          response: { status: 'error', result: {}, message: 'Catastrophic server error' },
          error: 'Catastrophic server error',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }
  }
}

// GET handler for health check and debugging
export async function GET() {
  try {
    return NextResponse.json({
      status: 'ok',
      message: 'F1 Fantasy AI Agent API is running',
      lyzr_api_key_configured: !!LYZR_API_KEY,
      environment: process.env.NODE_ENV || 'unknown',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: 'error',
        message: 'Failed to generate health check response',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
