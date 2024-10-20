import { webcrypto } from "crypto";

async function generateAESKey() {
  try {
    // Generate the AES-CBC key using webcrypto.subtle
    const key = await webcrypto.subtle.generateKey(
      {
        name: "AES-CBC",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"],
    );

    // Export the key in JWK format
    const jwk = await webcrypto.subtle.exportKey("jwk", key);

    // Output the key as a JSON string
    console.log(`SECRET_CLIENT_COOKIE_VAR=${JSON.stringify(jwk)}`);
  } catch (error) {
    console.error("Error generating key:", error);
  }
}

// Run the function inside an async IIFE (Immediately Invoked Function Expression)
void (async () => {
  await generateAESKey();
})();
