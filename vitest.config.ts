import {defineConfig} from "vitest/config";

export default defineConfig({
    test: {
        include: ["test/**/*.spec.{ts,js}"],
        globals: true,
        coverage: {
            provider: "v8",
        }
    },
});