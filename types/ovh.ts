export interface DomainSetupInstructions {
  cnameRecord: {
    name: string;
    target: string;
  };
  instructions: string[];
}

export interface StorageUploadFile {
  key: string;
  content: string;
  contentType: string;
}
