const express = require("express");
const router = express.Router();
const sebiController = require("../controllers/sebi/index");



// Create SEBI record
router.post("/", sebiController.createSEBI);

// Get all SEBI records
router.get("/", sebiController.getSEBIRecords);

// Get single SEBI record by ID
router.get("/:id", sebiController.getSEBIRecordById);

// Delete entire SEBI record
router.delete("/:id", sebiController.deleteSEBIRecord);

/* =====================================================
   🟡 NESTED FIELD EDIT ROUTES
   
   These handle editing of nested fields within tables
   Format: /sebi/:id/field/:tableType/:tableId
===================================================== */

router.put(
   "/:id/field/:tableType/:tableId",
   sebiController.editNestedField
);


router.put(
   "/:id/single/:tableType/:itemId",
   sebiController.editSingleLevelItem
);

/* =====================================================
   🔴 NESTED FIELD DELETION ROUTES
===================================================== */

router.delete(
   "/:id/field/:tableType/:tableId/:fieldId",
   sebiController.deleteNestedField
);

/* =====================================================
   🔴 SINGLE-LEVEL ITEM DELETION ROUTES
===================================================== */

router.delete(
   "/:id/single/:tableType/:itemId",
   sebiController.deleteSingleLevelItem
);

/* =====================================================
   🔴 TABLE DELETION ROUTE
===================================================== */

router.delete(
   "/:id/table/:tableType/:tableId",
   sebiController.deleteSpecificTable
);

/* =====================================================
   🟢 FALLBACK UPDATE ROUTE (should be last)
===================================================== */

// Update SEBI record (for main fields only)
router.put("/:id", sebiController.updateSEBIRecord);

router.delete("/:id", sebiController.deleteSEBI)

module.exports = router;