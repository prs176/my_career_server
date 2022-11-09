const express = require("express");
const cors = require("cors");
const { Log, Record } = require("../models");
const { verifyToken } = require("./middlewares");

const router = express.Router();

router.use(cors({ credentials: true }));

router.post("/:recordId", verifyToken, async (req, res, next) => {
  const { title, intro, period, learning, contribution, overcame, etc } = req.body;
  try {
    const record = await Record.findOne({ where: { id: req.params.recordId } });
    if (record) {
      await Log.create({
        RecordId: req.params.recordId,
        title,
        intro,
        period,
        learning,
        contribution,
        overcame,
        etc,
      });

      res.status(201).json({
        code: 201,
        message: "로그가 생성되었습니다.",
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

router.put("/:id", verifyToken, async (req, res, next) => {
  const { title, intro, period, learning, contribution, overcame, etc } = req.body;
  try {
    const log = await Log.findOne({
      where: { id: req.params.id },
    });
    if (log) {
      await log.update({
        title,
        intro,
        period,
        learning,
        contribution,
        overcame,
        etc,
      });

      res.status(201).json({
        code: 201,
        message: "로그가 수정되었습니다.",
      });
    } else {
      res.status(404).json({
        code: 404,
        message: "존재하지 않는 로그입니다.",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete("/:id", verifyToken, async (req, res, next) => {
  try {
    const log = await Log.findOne({
      where: { id: req.params.id },
    });
    if (log) {
      await log.destroy();

      res.status(201).json({
        code: 201,
        message: "로그가 삭제되었습니다.",
      });
    } else {
      res.status(404).json({
        code: 404,
        message: "존재하지 않는 로그입니다.",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
