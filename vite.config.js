import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, "index.js"),
            formats: ["es", "cjs"],
            name: "modern-linq",
        },
    },
    test: {
        include: ["test/**/*.spec.{ts,js}"],
        globals: true,
    },
});
