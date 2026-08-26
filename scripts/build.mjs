async function main() {
  try {
    const { build: buildClient } = await import("vite");
    await buildClient();

    if (process.env.GITHUB_ACTIONS === "true") {
      console.log("Client build completed for Android packaging.");
      return;
    }

    const { build: buildServer } = await import("esbuild");
    await buildServer({
      entryPoints: ["server/index.ts"],
      platform: "node",
      packages: "external",
      bundle: true,
      format: "esm",
      outdir: "dist",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`::error file=scripts/build.mjs,title=Build failed::${message.replace(/\r?\n/g, " ")}`);
    console.error(error);
    process.exitCode = 1;
  }
}

main();