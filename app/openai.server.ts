import { Configuration, OpenAIApi } from "openai";
import type { SafeGift } from "./types/gift";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
export const openai = new OpenAIApi(configuration);

export async function test() {
    try {
        const response = await openai.createCompletion({
            model: "gpt-3.5-turbo",
            prompt: "Who are you?",
            temperature: 0,
            max_tokens: 7,
        });
        console.log(response.data.choices);

    } catch (error) {
        console.log("Something went horribly wrong");
    }
}

export async function AskGpt(gifts: SafeGift[]): Promise<string> {
    const prompt = `Jeg lager ønskeliste. Jeg trenger hjelp til å komme på 3 konkrete ønsker. Kan du hjelpe meg, her er ønskene mine så langtJeg lager en ønskeliste og ønsker noen unike og kreative forslag. Kan du hjelpe meg med å komme på tre originale og overraskende ønsker basert på mine tidligere ønsker: ${gifts.map(gift => gift.name)}. Tenk utenfor boksen. Svar kortfattet og ikke svar med noe mer tekst enn de 3 forslagene.`;
    try {
        const response = await openai.createChatCompletion({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.8,
            max_tokens: 300,
            n: 1
        });
        console.log(response.data.choices);
        return response.data.choices[0].message?.content ?? "noe gikk galt";

    } catch (error) {
        console.log(error);
        return "Fikk ikke laget noen gaveforslag til deg 😥"
    }
}

export async function AskGptDebug(gifts: SafeGift[]): Promise<string> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("1. En ny sykkel - enten landeveissykkel eller terrengsykkel, avhengig av hva slags sykling du liker å gjøre. 2. En god kvalitetsskjorte, som kan brukes både til hverdags og mer formelle anledninger. 3. En opplevelse som en tur eller et besøk til en spesiell restaurant eller attraksjon, slik at du kan skape minner og opplevelser som vil vare lenge.");
        }, 2000);
    });
}

export interface Chat {
    model: string;
    prompt: string;
    temperature: number;
    max_tokens: number;
}

export interface Choice {
    index: number;
    message: Message;
    finish_reason: string;
}

export interface Message {
    role: Role;
    content: string;
}

type Role = "system" | "user" | "assistant"