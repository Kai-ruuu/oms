const fs = require("fs")
const path = require("path")
const multer = require("multer")

const storageFolder = "storage"

const storageFolders = {
   root: storageFolder,
   logos: path.join(storageFolder, "logos"),
   qrCodes: path.join(storageFolder, "qr_codes"),
   variants: path.join(storageFolder, "variants"),
   receipts: path.join(storageFolder, "receipts"),
   receiptQrCodes: path.join(storageFolder, "receipt_qr_codes")
}

const init = () => {
   Object.values(storageFolders).forEach(folderPath => {
      if (!fs.existsSync(folderPath)) {
         fs.mkdirSync(folderPath, { recursive: true })
         console.log(`Created folder: ${folderPath}`)
      }
   })

   console.log("[STORAGE] Storage initialization complete.")
}

const newUploadHandler = (fieldFolderMap = null) => {
   if (!fieldFolderMap) {
      console.warn("[STORAGE] Invalid or missing fieldFolderMap. Falling back to .none()")
      
      return multer().none()
   }

   const fields = Object.keys(fieldFolderMap).map(fieldName => ({
      name: fieldName,
      maxCount: 1
   }))

   const storage = multer.diskStorage({
      destination: (_, file, cb) => {
         const folderPath = fieldFolderMap[file.fieldname]

         if (!folderPath) {
            console.warn(`[STORAGE] No folder path for field: ${file.fieldname}`)
            return cb(new Error("[STORAGE] Invalid upload field"), null)
         }
         
         cb(null, folderPath)
      },
      filename: (_, file, cb) => {
         const timestamp = Date.now()
         const ext = path.extname(file.originalname)
         const base = path.basename(file.originalname, ext)
         const safeBase = base.replace(/[^a-z0-9_\-]/gi, "_")

         cb(null, `${timestamp}-${safeBase}${ext}`)
      }
   })

   return multer({ storage }).fields(fields)
}

const remove = async (filePath=null, fileName=null) => {
   if (!filePath || !fileName) {
      console.warn("[STORAGE] Removed nothing, no file path or name was specified.")

      return
   }

   const fullPath = path.join(filePath, fileName)
   
   try {
      await fs.promises.unlink(fullPath)
      console.log("[STORAGE] Successfully removed", fileName)
   } catch (err) {
      if (err.code === 'ENOENT')
         console.warn("[STORAGE] File not found, nothing was removed from:", fullPath)
      else
         console.error("[STORAGE] Error removing file:", fullPath, err)
   }
}

module.exports = {
   storageFolders,
   init,
   newUploadHandler,
   remove
}
