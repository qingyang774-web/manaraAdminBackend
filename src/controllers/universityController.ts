import type { Request, Response } from 'express';
import { degreeLevels, type DegreeLevel } from '../constants/degreeLevels';
import { UniversityModel } from '../models/University';

const sanitizeStringArray = (value?: string[]) => {
  return Array.from(
    new Set((value ?? []).map((entry) => entry?.trim()).filter((entry): entry is string => Boolean(entry)))
  );
};

const sanitizePrograms = (programs?: Record<DegreeLevel, { name?: string; duration?: string; delivery?: string }[]>) => {
  return degreeLevels.reduce((acc, level) => {
    const list = programs?.[level] ?? [];
    acc[level] = list
      .map((program) => ({
        name: (program.name ?? '').trim(),
        duration: (program.duration ?? '').trim(),
        delivery: (program.delivery ?? '').trim()
      }))
      .filter((program) => program.name.length > 0);
    return acc;
  }, {} as Record<DegreeLevel, { name: string; duration: string; delivery: string }[]>);
};

const sanitizeScholarships = (
  scholarships?: Record<
    DegreeLevel,
    {
      name?: string;
      amount?: string;
      eligibility?: string;
      deadline?: string;
      hasTypes?: boolean;
      types?: { name?: string; amount?: string; eligibility?: string; deadline?: string }[];
    }[]
  >
) => {
  return degreeLevels.reduce((acc, level) => {
    const list = scholarships?.[level] ?? [];
    acc[level] = list
      .map((scholarship) => {
        const types = (scholarship.types ?? [])
          .map((type) => ({
            name: (type.name ?? '').trim(),
            amount: (type.amount ?? '').trim(),
            eligibility: (type.eligibility ?? '').trim(),
            deadline: (type.deadline ?? '').trim()
          }))
          .filter((type) => type.name.length > 0);

        return {
          name: (scholarship.name ?? '').trim(),
          amount: (scholarship.amount ?? '').trim(),
          eligibility: (scholarship.eligibility ?? '').trim(),
          deadline: (scholarship.deadline ?? '').trim(),
          hasTypes: Boolean(scholarship.hasTypes && types.length > 0),
          types
        };
      })
      .filter((scholarship) => scholarship.name.length > 0);
    return acc;
  }, {} as Record<DegreeLevel, unknown[]>);
};

export const getUniversities = async (req: Request, res: Response) => {
  try {
    const { search, location, degreeLevel } = req.query;
    const query: Record<string, unknown> = {};

    if (typeof search === 'string' && search.trim()) {
      query.name = { $regex: search.trim(), $options: 'i' };
    }

    if (typeof location === 'string' && location.trim()) {
      query.location = { $regex: `^${location.trim()}$`, $options: 'i' };
    }

    if (typeof degreeLevel === 'string' && degreeLevels.includes(degreeLevel as DegreeLevel)) {
      query[`programs.${degreeLevel}.0`] = { $exists: true };
    }

    const universities = await UniversityModel.find(query).sort({ name: 1 });
    res.json(universities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to load universities' });
  }
};

export const getUniversity = async (req: Request, res: Response) => {
  try {
    const university = await UniversityModel.findById(req.params.id);
    if (!university) {
      return res.status(404).json({ message: 'University not found' });
    }
    res.json(university);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to load university' });
  }
};

export const createUniversity = async (req: Request, res: Response) => {
  try {
    const { name, portalUrl, location, overview, fees, programs, scholarships, chineseLanguagePrograms, restrictedCountries } =
      req.body;

    if (!name || !portalUrl || !location) {
      return res.status(400).json({ message: 'Name, portal link, and location are required.' });
    }

    const document = await UniversityModel.create({
      name: name.trim(),
      portalUrl: portalUrl.trim(),
      location: location.trim(),
      overview: overview?.trim() ?? '',
      fees: {
        application: Number(fees?.application) || 0,
        averageTuition: fees?.averageTuition ?? {}
      },
      programs: sanitizePrograms(programs),
      scholarships: sanitizeScholarships(scholarships),
      chineseLanguagePrograms: sanitizeStringArray(chineseLanguagePrograms),
      restrictedCountries: sanitizeStringArray(restrictedCountries)
    });

    res.status(201).json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to create university' });
  }
};

export const updateUniversity = async (req: Request, res: Response) => {
  try {
    const { name, portalUrl, location, overview, fees, programs, scholarships, chineseLanguagePrograms, restrictedCountries } =
      req.body;

    const updatePayload: Record<string, unknown> = {};

    if (name !== undefined) updatePayload.name = name.trim();
    if (portalUrl !== undefined) updatePayload.portalUrl = portalUrl.trim();
    if (location !== undefined) updatePayload.location = location.trim();
    if (overview !== undefined) updatePayload.overview = overview?.trim();
    if (fees !== undefined) {
      updatePayload.fees = {
        application: Number(fees?.application) || 0,
        averageTuition: fees?.averageTuition ?? {}
      };
    }
    if (programs !== undefined) {
      updatePayload.programs = sanitizePrograms(programs);
    }
    if (scholarships !== undefined) {
      updatePayload.scholarships = sanitizeScholarships(scholarships);
    }
    if (chineseLanguagePrograms !== undefined) {
      updatePayload.chineseLanguagePrograms = sanitizeStringArray(chineseLanguagePrograms);
    }
    if (restrictedCountries !== undefined) {
      updatePayload.restrictedCountries = sanitizeStringArray(restrictedCountries);
    }

    const updated = await UniversityModel.findByIdAndUpdate(req.params.id, updatePayload, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ message: 'University not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to update university' });
  }
};

export const deleteUniversity = async (req: Request, res: Response) => {
  try {
    const deleted = await UniversityModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'University not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to delete university' });
  }
};

