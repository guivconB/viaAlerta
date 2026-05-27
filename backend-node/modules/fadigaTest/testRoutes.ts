import { Router } from "express";
import { createTestResult, getHistory } from "./testController.js";
import { authMiddleware } from "../../src/middlewares/auth.js"; // Assuming standard path

const router = Router();

// Protect all test routes with authentication
router.use(authMiddleware);

router.post("/", createTestResult);
router.get("/", getHistory);

export default router;
