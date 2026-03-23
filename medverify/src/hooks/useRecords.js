import { useState } from "react";
import { PATIENT_RECORDS } from "../data/mockData.js";

/**
 * useRecords
 * Manages the patient's medical record list.
 * Initialises with mock data; in production swap the
 * useState seed for an API call inside a useEffect.
 *
 * Returns:
 *  records      – array of record objects
 *  addRecord    – prepend a new record and return the updated list
 *  removeRecord – remove a record by id
 *  totalCount   – total number of records
 *  verifiedCount – records with status === "verified"
 *  pendingCount  – records with status === "pending"
 */
export function useRecords() {
  const [records, setRecords] = useState(PATIENT_RECORDS);

  const addRecord = (record) => {
    setRecords(prev => [record, ...prev]);
  };

  const removeRecord = (id) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const verifiedCount = records.filter(r => r.status === "verified").length;
  const pendingCount  = records.filter(r => r.status === "pending").length;

  return {
    records,
    addRecord,
    removeRecord,
    totalCount:    records.length,
    verifiedCount,
    pendingCount,
  };
}
