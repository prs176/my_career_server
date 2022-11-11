const express = require("express");
const cors = require("cors");
const { Record, Log } = require("../models");
const { verifyToken } = require("./middlewares");

const router = express.Router();

router.use(cors({ credentials: true }));

router.get("/:userId", async (req, res, next) => {
  try {
    var records = await Record.findAll({
      attributes: [
        "id",
        "type",
        "name",
        "role",
        "period",
        "description",
        "department",
        "from",
        "start",
        "end",
        "identifier",
      ],
      where: { UserId: req.params.userId },
      include: [{ model: Log, attributes: ["id"] }],
    });

    records = records.map((record) => {
      const count = record.Logs.length;

      return {
        id: record.id,
        type: record.type,
        name: record.name,
        role: record.role,
        period: record.period,
        description: record.description,
        department: record.department,
        from: record.from,
        start: record.start,
        end: record.end,
        identifier: record.identifier,
        count: count,
      };
    });

    res.status(200).json({
      code: 200,
      message: "이력이 조회되었습니다.",
      response: records,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/", verifyToken, async (req, res, next) => {
  const { type, name, role, period, description, department, from, start, end, identifier } =
    req.body;
  try {
    await Record.create({
      UserId: req.decoded.id,
      type,
      name,
      role,
      period,
      description,
      department,
      from,
      start,
      end,
      identifier,
    });

    res.status(201).json({
      code: 201,
      message: "이력이 생성되었습니다.",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.put("/:id", verifyToken, async (req, res, next) => {
  const { name, role, period, description, department, from, start, end, identifier } = req.body;
  try {
    const record = await Record.findOne({
      where: { id: req.params.id },
    });
    if (record) {
      await record.update({
        name,
        role,
        period,
        description,
        department,
        from,
        start,
        end,
        identifier,
      });

      res.status(201).json({
        code: 201,
        message: "이력이 수정되었습니다.",
      });
    } else {
      res.status(404).json({
        code: 404,
        message: "존재하지 않는 이력입니다.",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const record = await Record.findOne({
      where: { id: req.params.id },
    });
    if (record) {
      await record.destroy();
      res.status(201).json({
        code: 201,
        message: "이력이 삭제되었습니다.",
      });
    } else {
      res.status(404).json({
        code: 404,
        message: "존재하지 않는 이력입니다.",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
