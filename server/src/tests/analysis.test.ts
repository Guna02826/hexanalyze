import { jest } from '@jest/globals';

// In Modern JavaScript (ES Modules), we MUST setup mocks before importing the app!
// We use unstable_mockModule to intercept the calls.
jest.unstable_mockModule("@google/genai", () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => {
      return {
        models: {
          generateContent: jest.fn().mockResolvedValue({
            text: JSON.stringify({
              matchScore: 85,
              matchingSkills: ["React"],
              missingKeywords: ["Docker"],
              suggestions: ["Add Docker experience"]
            })
          })
        }
      };
    })
  };
});

jest.unstable_mockModule("../utils/cloudinary.js", () => {
  return {
    uploadToCloudinary: jest.fn().mockResolvedValue("http://fake-image.com")
  };
});

// Now we DYNAMICALLY import supertest and our app AFTER the mocks are set up!
const { default: request } = await import("supertest");
const { default: app } = await import("../app.js");

// A minimal valid PDF file so the real pdf-parser doesn't crash
const minimalPdf = Buffer.from(
  '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Resources <<\n/Font <<\n/F1 4 0 R\n>>\n>>\n/Contents 5 0 R\n>>\nendobj\n4 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\nendobj\n5 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(Fake Resume) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000224 00000 n \n0000000311 00000 n \ntrailer\n<<\n/Size 6\n/Root 1 0 R\n>>\nstartxref\n406\n%%EOF',
  'utf8'
);

describe("Analysis Route Tests", () => {
  let token: string;

  beforeAll(async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Analysis Tester",
      email: "analysis@test.com",
      password: "password123"
    });
    token = res.body.token;
  });

  it("should successfully analyze a resume and return data", async () => {
    const response = await request(app)
      .post("/api/analyze")
      .set("Authorization", `Bearer ${token}`) 
      .field("jobDescription", "We are looking for a highly skilled React developer with at least 5 years of experience building modern web applications using TypeScript and Node.js.") 
      .attach("resume", minimalPdf, { filename: "resume.pdf", contentType: "application/pdf" }); 

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("matchScore", 85);
  });
});
