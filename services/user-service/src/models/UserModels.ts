import mongoose, { Document, Schema } from 'mongoose';

export interface IGeneral extends Document {
  memberId: mongoose.Types.ObjectId;
  paymentId: string;
  subscription: string;
}

const GeneralSchema: Schema = new Schema({
  memberId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
  paymentId: { type: String, required: true },
  subscription: { type: String, required: true },
});

export const General = mongoose.model<IGeneral>('General', GeneralSchema);

export interface ITeam extends Document {
  team_name: string;
  description?: string;
  img?: string;
  members: mongoose.Types.ObjectId[];
}

const TeamSchema: Schema = new Schema({
  team_name: { type: String, required: true },
  description: { type: String },
  img: { type: String },
  members: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
});

export const Team = mongoose.model<ITeam>('Team', TeamSchema);

export interface ITeamMember extends Document {
  teamId: mongoose.Types.ObjectId;
  memberId: mongoose.Types.ObjectId;
  position: string;
  isAdmin: boolean;
}

const TeamMemberSchema: Schema = new Schema({
  teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  memberId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
  position: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

export const TeamMember = mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);
