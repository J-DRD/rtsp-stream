// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
export interface Config {
  server: Server;
  streams: Streams;
  client: Client;
}

export interface Server {
  httpPort: number;
  httpsPort: number;
  encoderPort: string;
  iceServers?: null[] | null;
  webrtcMinPort: number;
  webrtcMaxPort: number;
  retryConnectSec: number;
  startStreamServer: boolean;
}

export interface Streams {
  [key: string]: StreamConfig;
}

export interface Street {
  debug: boolean;
  url: string;
}

export interface StreamConfig {
  description?: string;
  debug?: boolean;
  url: string;
}

export interface Client {
  debug: boolean;
  defaultStream: string;
}
