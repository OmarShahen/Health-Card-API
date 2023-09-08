"use strict";

var utils = require('../../utils/utils');

var addFolder = function addFolder(folderData) {
  var clinicId = folderData.clinicId,
      creatorId = folderData.creatorId,
      parentFolderId = folderData.parentFolderId,
      name = folderData.name,
      isPinned = folderData.isPinned,
      isStarred = folderData.isStarred;
  if (!creatorId) return {
    isAccepted: false,
    message: 'Creator ID is required',
    field: 'creatorId'
  };
  if (!utils.isObjectId(creatorId)) return {
    isAccepted: false,
    message: 'Creator ID format is invalid',
    field: 'creatorId'
  };
  if (parentFolderId && !utils.isObjectId(parentFolderId)) return {
    isAccepted: false,
    message: 'Parent folder ID format is invalid',
    field: 'parentFolderId'
  };
  if (!parentFolderId && !clinicId) return {
    isAccepted: false,
    message: 'Clinic ID is required',
    field: 'clinicId'
  };
  if (!parentFolderId && !utils.isObjectId(clinicId)) return {
    isAccepted: false,
    message: 'Clinic ID format is invalid',
    field: 'clinicId'
  };
  if (!name) return {
    isAccepted: false,
    message: 'Folder name is required',
    field: 'name'
  };
  if (typeof name != 'string') return {
    isAccepted: false,
    message: 'Folder name format is invalid',
    field: 'name'
  };
  if (isPinned && typeof isPinned != 'boolean') return {
    isAccepted: false,
    message: 'Pinned format is invalid',
    field: 'isPinned'
  };
  if (isStarred && typeof isStarred != 'boolean') return {
    isAccepted: false,
    message: 'Starred format is invalid',
    field: 'isStarred'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: folderData
  };
};

var addPatientFolder = function addPatientFolder(folderData) {
  var patientId = folderData.patientId,
      clinicId = folderData.clinicId,
      creatorId = folderData.creatorId,
      parentFolderId = folderData.parentFolderId,
      name = folderData.name,
      isPinned = folderData.isPinned,
      isStarred = folderData.isStarred;
  if (!patientId) return {
    isAccepted: false,
    message: 'Patient ID is required',
    field: 'patientId'
  };
  if (!utils.isObjectId(patientId)) return {
    isAccepted: false,
    message: 'Patient ID format is invalid',
    field: 'patientId'
  };
  if (!creatorId) return {
    isAccepted: false,
    message: 'Creator ID is required',
    field: 'creatorId'
  };
  if (!utils.isObjectId(creatorId)) return {
    isAccepted: false,
    message: 'Creator ID format is invalid',
    field: 'creatorId'
  };
  if (parentFolderId && !utils.isObjectId(parentFolderId)) return {
    isAccepted: false,
    message: 'Parent folder ID format is invalid',
    field: 'parentFolderId'
  };
  if (!parentFolderId && !clinicId) return {
    isAccepted: false,
    message: 'Clinic ID is required',
    field: 'clinicId'
  };
  if (!parentFolderId && !utils.isObjectId(clinicId)) return {
    isAccepted: false,
    message: 'Clinic ID format is invalid',
    field: 'clinicId'
  };
  if (!name) return {
    isAccepted: false,
    message: 'Folder name is required',
    field: 'name'
  };
  if (typeof name != 'string') return {
    isAccepted: false,
    message: 'Folder name format is invalid',
    field: 'name'
  };
  if (isPinned && typeof isPinned != 'boolean') return {
    isAccepted: false,
    message: 'Pinned format is invalid',
    field: 'isPinned'
  };
  if (isStarred && typeof isStarred != 'boolean') return {
    isAccepted: false,
    message: 'Starred format is invalid',
    field: 'isStarred'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: folderData
  };
};

var updateFolderName = function updateFolderName(folderData) {
  var name = folderData.name;
  if (!name) return {
    isAccepted: false,
    message: 'Folder name is required',
    field: 'name'
  };
  if (typeof name != 'string') return {
    isAccepted: false,
    message: 'Folder name format is invalid',
    field: 'name'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: folderData
  };
};

module.exports = {
  addFolder: addFolder,
  addPatientFolder: addPatientFolder,
  updateFolderName: updateFolderName
};