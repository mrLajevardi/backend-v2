export interface AcquireTicketDto {
  otherAttributes: OtherAttributes;
  host: string;
  vmx: string;
  ticket: string;
  port: number;
  vCloudExtension: any[];
}

type OtherAttributes = Record<string, never>;
