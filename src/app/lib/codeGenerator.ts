import { XMLParser } from "fast-xml-parser";

export type GenerateMode = "request" | "response";

export function generateCode(xml: string, mode: GenerateMode) {
 if (!xml.trim()) {
  return "";
 }

 if (mode === "request") {
  return generateRequestCode(xml);
 }

 return generateResponseCode();
}

function generateRequestCode(xml: string) {
 const methodName = extractSoapMethod(xml);

 return `import axios from "axios";

export async function ${methodName}() {
  const soapBody = \`
${xml}
  \`;

  const response = await axios.post(
    "URL_DO_SERVICO_SOAP",
    soapBody,
    {
      headers: {
        "Content-Type": "text/xml;charset=UTF-8",
        "SOAPAction": "${methodName}",
      },
    }
  );

  return response.data;
}`;
}

function generateResponseCode() {
 return `import { XMLParser } from "fast-xml-parser";

export function parseSoapResponse(xml: string) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    removeNSPrefix: true,
  });

  const json = parser.parse(xml);

  return json.Envelope.Body;
}`;
}

function extractSoapMethod(xml: string) {
 try {
  const parser = new XMLParser({
   ignoreAttributes: false,
   removeNSPrefix: true,
  });

  const json = parser.parse(xml);

  const body = json?.Envelope?.Body;

  if (!body) {
   return "executeSoapRequest";
  }

  const methodName = Object.keys(body)[0];

  return methodName || "executeSoapRequest";
 } catch {
  return "executeSoapRequest";
 }
}
