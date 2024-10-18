import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createOpenAI } from "@ai-sdk/openai"
import { generateObject, generateText } from "ai"
import { z } from "zod"

import type { PlasmoMessaging } from "@plasmohq/messaging"

import type { TextNode } from "~interface/node"

const google = createGoogleGenerativeAI({
  apiKey: process.env.PLASMO_PUBLIC_GOOGLE_API_KEY
})

const handler: PlasmoMessaging.MessageHandler<{ nodes: TextNode[] }> = async (
  req,
  res
) => {
  const { nodes } = req.body
  const texts = nodes.map(({ text }) => text)

  const prompt = `${JSON.stringify(texts)} 이 배열을 한글로 번역해줘. 자바스크립트 개발에 관련된 내용이니 자연스럽게 번역해줘 JSON.stringify를 사용하지 않고 순서 그대로 배열을 번환해줘.`

  const schema = z.object({
    result: z.array(z.string())
  })

  try {
    const { object } = await generateObject({
      model: google("gemini-1.5-flash-latest"),
      schema,
      prompt: prompt
    })

    res.send({
      status: "success",
      data: object,
      prompt
    })
  } catch (e) {
    res.send({
      status: "error",
      data: e,
      prompt
    })
  }
}

export default handler
