const router = require('express').Router();
const HabitModel = require("../models/appModel");

// ----------------------Get the Habits on page-------------------------->>
router.get("/",async (req, res) => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const today = new Date();
    today.setDate(today.getDate() + i);
    const newDate = today.toLocaleDateString('pt-br').split('/').reverse().join('-');
    days.push(newDate);
  }
  const habits =await HabitModel.find({});
  res.render("home", { habits: habits, days: days});
})

//--------------------Enter new habit Section--------------------------------->>
router.post("/enterhabit", async (req, res) => {
  const { habitName } = req.body;

  if(habitName.length === 0){
     return res.redirect("back");
  }
  HabitModel.findOne({ habitName: habitName }).then((habit) => {
    console.log(habit);
    if (habit) {
      const dates = habit.dates;
      const newDate = new Date();
      const today = newDate.toLocaleDateString('pt-br').split('/').reverse().join('-');
      console.log(today);
      dates.find((ele, index) => {
        if (ele.date === today) {
          res.send('habit already exist');
        } else {
          dates.push({ date: today, status: "pending" })
          habit.dates = dates;
          habit.save().then(()=>{
            res.redirect("back");
          }).catch((err)=>{
            res.redirect("back");
          });
        }
      })
    } else {
      const dates = [];
      const dateOffSet = (new Date()).getTimezoneOffset() * 60000;
      const localTime = (new Date(Date.now() - dateOffSet)).toISOString().slice(0, 10);
      dates.push({ date: localTime, status: "pending" });
      const newHabitElement = new HabitModel({
        habitName: habitName,
        dates: dates
      });
      newHabitElement.save().catch(()=>{
        res.redirect("back");
      });
    }
  })
  res.redirect("/");
})

//---------------------Update the habit status by date----------------------->>
router.get("/habitstatus",async (req, res) => {
  const date = req.query.date;
  const dateId = req.query.id;
 await HabitModel.findById(dateId).then(async(habit) => {
    const dates = habit.dates;
    let found = false;

    dates.find((ele, index) => {
      if (ele.date === date) {
        if (ele.status === "done") {
          ele.status = "notdone"
        } else if (ele.status === "notdone") {
          ele.status = "pending"
        } else if (ele.status === "pending") {
          ele.status = "done";
        }
        found = true;
      }
    })
    if (!found) {
      dates.push({ date: date, status: "done" });
    }
    habit.dates = dates;
    return habit.save().then((updatedHabit) => {
      console.log(updatedHabit);
      res.redirect("back");
    }).catch((err) => {
      console.log(err);
      res.status(500).send("Error");
    });
  })
});

//---------------------Delete the particular Habit------------------------->>
router.get("/:id", async (req, res) => {
  await HabitModel.findOneAndRemove({ _id: req.params.id }).then(() => {
    res.redirect("/");
  }).catch((err) => {
    console.log(err);
  });
})
module.exports = router;