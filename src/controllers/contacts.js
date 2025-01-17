import createHttpError from 'http-errors';
import * as contactServices from '../services/contacts.js';
import { saveFileToUploadsDir } from '../utils/saveFileToUploadsDir.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { sortByList } from '../db/models/Contact.js';
import { parseContactsFilterParams } from '../utils/filters/parseContactsFilterParams.js';
import { getEnvVar } from '../utils/getEnvVar.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);
  const filter = parseContactsFilterParams(req.query);
  filter.userId = req.user._id;

  const contacts = await contactServices.getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactsByIdController = async (req, res) => {
  const { _id: userId } = req.user;
  const { contactId: _id } = req.params;

  const data = await contactServices.getContact({ _id, userId });
  if (!data) {
    throw createHttpError(404, `Contact with id=${_id} not found`);
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${_id}!`,
    data,
  });
};

export const addContactController = async (req, res) => {
  const cloudinaryEnable = getEnvVar('CLOUDINARY_ENABLE') === 'true';
  let photo;
  if (req.file) {
    if (cloudinaryEnable) {
      photo = await saveFileToCloudinary(req.file);
    } else {
      photo = await saveFileToUploadsDir(req.file);
    }
  }

  const { _id: userId } = req.user;
  const data = await contactServices.addContact({ ...req.body, photo, userId });
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const upsertContactController = async (req, res) => {
  const cloudinaryEnable = getEnvVar('CLOUDINARY_ENABLE') === 'true';
  let photo;
  if (req.file) {
    if (cloudinaryEnable) {
      photo = await saveFileToCloudinary(req.file);
    } else {
      photo = await saveFileToUploadsDir(req.file);
    }
  }

  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const { isNew, data } = await contactServices.updateContact(
    { _id: contactId, userId },
    { ...req.body, photo, userId },
    {
      upsert: true,
    },
  );
  const status = isNew ? 201 : 200;
  res.status(status).json({
    status,
    message: `Successfully upserted a contact!`,
    data,
  });
};

export const patchContactController = async (req, res) => {
  const cloudinaryEnable = getEnvVar('CLOUDINARY_ENABLE') === 'true';
  let photo;
  if (req.file) {
    if (cloudinaryEnable) {
      photo = await saveFileToCloudinary(req.file);
    } else {
      photo = await saveFileToUploadsDir(req.file);
    }
  }

  const { contactId: _id } = req.params;
  const { _id: userId } = req.user;
  const result = await contactServices.updateContact(
    { _id, userId },
    { ...req.body, photo },
  );

  if (!result) {
    throw createHttpError(404, `Contact with id=${_id} not found`);
  }
  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.data,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId: _id } = req.params;
  const { _id: userId } = req.user;
  const data = await contactServices.deleteContact({ _id, userId });

  if (!data) {
    throw createHttpError(404, `Contact with id=${_id} not found`);
  }
  res.status(204).send();
};
