// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
import dotenv from "dotenv";
import { findUpSync } from "find-up";

const { env: { ENV_FILE: envFile = ".env" } = {} } = process;
const findEnv = () => findUpSync(envFile);
dotenv.config({ path: findEnv() });
export {};
