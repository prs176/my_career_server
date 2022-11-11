const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { User, sequelize } = require("../models");
const { verifyToken, verifyOptionalToken } = require("./middlewares");

const router = express.Router();

router.use(cors({ credentials: true }));

router.get("/search", async (req, res, next) => {
  try {
    var users = await User.findAll({
      attributes: ["id", "email", "name", "birth", "intro"],
      include: [
        {
          model: User,
          attributes: ["id"],
          as: "GoodMarkUsers",
        },
      ],
    });

    users = users.map((user) => {
      const good = user.GoodMarkUsers.length;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        birth: user.birth,
        intro: user.intro,
        good: good,
      };
    });

    res.status(200).json({
      code: 200,
      message: "사용자가 조회되었습니다.",
      response: users,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/search/:keyword", async (req, res, next) => {
  try {
    var users = await User.findAll({
      attributes: ["id", "email", "name", "birth", "intro"],
      include: [
        {
          model: User,
          attributes: ["id"],
          as: "GoodMarkUsers",
        },
      ],
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${req.params.keyword}%`,
            },
          },
          {
            intro: {
              [Op.like]: `%${req.params.keyword}%`,
            },
          },
        ],
      },
    });

    users = users.map((user) => {
      const good = user.GoodMarkUsers.length;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        birth: user.birth,
        intro: user.intro,
        good: good,
      };
    });

    res.status(200).json({
      code: 200,
      message: "사용자가 조회되었습니다.",
      response: users,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/myid", verifyToken, (req, res, next) => {
  try {
    res.status(200).json({
      code: 200,
      message: "사용자 아이디가 조회되었습니다.",
      response: req.decoded.id,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/:id", verifyOptionalToken, async (req, res, next) => {
  try {
    const user = await User.findOne({
      attributes: ["id", "email", "name", "birth", "intro"],
      include: [{ model: User, attributes: ["id"], as: "GoodMarkUsers" }],
      where: { id: req.params.id },
    });
    if (user) {
      const good = user.GoodMarkUsers.length;
      const isMine = req.decoded !== undefined && req.decoded.id === user.id;
      const isGood =
        req.decoded !== undefined &&
        user.GoodMarkUsers.map((user) => user.id).includes(req.decoded.id);

      res.status(200).json({
        code: 200,
        message: "사용자가 조회되었습니다.",
        response: {
          id: user.id,
          email: user.email,
          name: user.name,
          birth: user.birth,
          intro: user.intro,
          good: good,
          isMine: isMine,
          isGood: isGood,
        },
      });
    } else {
      res.status(404).json({
        code: 404,
        message: "존재하지 않는 사용자입니다.",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/good/:id", verifyToken, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    if (user) {
      user.addGoodMarkUser(parseInt(req.decoded.id, 10));

      res.json({
        code: 201,
        message: "좋아요를 표시했습니다.",
        response: user,
      });
    } else {
      res.status(404).json({
        code: 404,
        message: "존재하지 않는 사용자입니다.",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/notgood/:id", verifyToken, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    if (user) {
      user.removeGoodMarkUser(parseInt(req.decoded.id, 10));

      res.json({
        code: 201,
        message: "좋아요를 취소했습니다.",
      });
    } else {
      res.status(404).json({
        code: 404,
        message: "존재하지 않는 사용자입니다.",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/register", async (req, res, next) => {
  const { email, password, name, birth, intro } = req.body;
  try {
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      password: hash,
      name,
      birth,
      intro,
    });

    res.status(201).json({ code: 201, message: "가입되었습니다." });
  } catch (err) {
    console.error(err);
    if (err.message === "Validation error") {
      err.status = 403;
      err.message = "이미 존재하는 아이디입니다.";
    }
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email },
    });
    if (user) {
      const result = await bcrypt.compare(req.body.password, user.password);
      if (result) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "24h",
          issuer: "my_career",
        });
        res.json({
          code: 200,
          message: "토큰이 발급되었습니다.",
          response: token,
        });
      } else {
        res.status(401).json({
          code: 401,
          message: "잘못된 비밀번호입니다.",
        });
      }
    } else {
      res.status(401).json({
        code: 401,
        message: "가입되지 않은 아이디입니다.",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.put("/", verifyToken, async (req, res, next) => {
  const { name, birth, intro } = req.body;
  try {
    const user = await User.findOne({
      where: { id: req.decoded.id },
    });
    if (user) {
      await user.update({
        name,
        birth,
        intro,
      });

      res.status(201).json({
        code: 201,
        message: "사용자 정보가 수정되었습니다.",
      });
    } else {
      res.status(404).json({
        code: 404,
        message: "존재하지 않는 사용자입니다.",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
