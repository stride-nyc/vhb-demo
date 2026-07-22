export interface Party {
  party: number;
  primaryObject: string;
  primaryObjectLoc: string | null;
  other1Object: string | null;
  other1Loc: string | null;
  other2Object: string | null;
  other2Loc: string | null;
  other3Object: string | null;
  other3Loc: string | null;
  vehHwyIndicator: number;
  partyType: string;
  movement: string;
  direction: string;
  ccuMvmt: string | null;
  ccuDir: string | null;
}

export interface Collision {
  collisionId: number;
  reportNumber: string;
  fileType: string;
  district: number;
  county: string;
  ir: number;
  hwyRelated: boolean;
  locationComplete: string | null;
  updateDate: string;
  comment: string;
  additionalPartyCount: number;
  soeComplete: string | null;
  codingComment?: string;
  parties: Party[];
}
