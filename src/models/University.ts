import mongoose, { Schema, type InferSchemaType } from 'mongoose';
import { degreeLevels, type DegreeLevel } from '../constants/degreeLevels';

const programSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    duration: { type: String, default: '', trim: true },
    delivery: { type: String, default: '', trim: true }
  },
  { _id: false }
);

const scholarshipTypeSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    amount: { type: String, default: '', trim: true },
    eligibility: { type: String, default: '', trim: true },
    deadline: { type: String, default: '', trim: true }
  },
  { _id: false }
);

const scholarshipSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    amount: { type: String, default: '', trim: true },
    eligibility: { type: String, default: '', trim: true },
    deadline: { type: String, default: '', trim: true },
    hasTypes: { type: Boolean, default: false },
    types: { type: [scholarshipTypeSchema], default: [] }
  },
  { _id: false }
);

const programsSchemaDefinition: Record<DegreeLevel, unknown> = {
  bachelor: { type: [programSchema], default: [] },
  masters: { type: [programSchema], default: [] },
  phd: { type: [programSchema], default: [] }
};

const scholarshipsSchemaDefinition: Record<DegreeLevel, unknown> = {
  bachelor: { type: [scholarshipSchema], default: [] },
  masters: { type: [scholarshipSchema], default: [] },
  phd: { type: [scholarshipSchema], default: [] }
};

const universitySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    portalUrl: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    overview: { type: String, default: '', trim: true },
    fees: {
      application: { type: Number, default: 0 },
      averageTuition: {
        bachelor: { type: Number },
        masters: { type: Number },
        phd: { type: Number }
      }
    },
    programs: programsSchemaDefinition,
    scholarships: scholarshipsSchemaDefinition,
    chineseLanguagePrograms: { type: [String], default: [] },
    restrictedCountries: { type: [String], default: [] }
  },
  {
    timestamps: true
  }
);

universitySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: Record<string, any>) => {
    if (ret._id) {
      ret.id = ret._id.toString();
      delete ret._id;
    }
    return ret;
  }
});

export type UniversityDocument = InferSchemaType<typeof universitySchema> & { id: string };

export const UniversityModel = mongoose.model('University', universitySchema);

