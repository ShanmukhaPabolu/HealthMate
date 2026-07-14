const TrackerLogs = require('../models/TrackerLogs');
const User = require('../models/User');

// @desc    Get user activity log
// @route   GET /api/user/activities
// @access  Private
exports.getActivities = async (req, res, next) => {
  try {
    const email = req.user.email;
    const date = req.query.date || new Date().toISOString().split('T')[0];

    const activity = await TrackerLogs.findOne({
      userEmail: email,
      category: 'activity',
      date
    });

    if (!activity) {
      return res.status(200).json({ water: 0, sleep: 0, calories: 0 });
    }

    res.status(200).json({
      _id: activity._id,
      water: activity.activity.waterIntake || 0,
      sleep: activity.activity.sleepDuration || 0,
      calories: activity.activity.caloriesTarget || 0,
      date: activity.date
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Log/Update user activities
// @route   POST /api/user/activities
// @access  Private
exports.logActivity = async (req, res, next) => {
  try {
    const email = req.user.email;
    const date = req.body.date || new Date().toISOString().split('T')[0];
    const { water, sleep, calories } = req.body;

    const activityData = {
      waterIntake: water,
      sleepDuration: sleep,
      caloriesTarget: calories
    };

    const updatedLog = await TrackerLogs.findOneAndUpdate(
      { userEmail: email, category: 'activity', date },
      {
        $set: {
          activity: activityData,
          updatedAt: new Date()
        }
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, message: 'Activity logged successfully', data: updatedLog });
  } catch (err) {
    next(err);
  }
};

// @desc    Get reminders
// @route   GET /api/user/reminders
// @access  Private
exports.getReminders = async (req, res, next) => {
  try {
    const email = req.user.email;
    const reminders = await TrackerLogs.find({ userEmail: email, category: 'reminder' }).sort('-createdAt');
    
    // Map response keys compatible with frontends
    const formatted = reminders.map(r => ({
      _id: r._id,
      details: r.reminder.details,
      category: r.reminder.type, // compatible with category 'medication' or 'appointment'
      time: r.reminder.time,
      created_at: r.createdAt
    }));

    res.status(200).json(formatted);
  } catch (err) {
    next(err);
  }
};

// @desc    Add reminder
// @route   POST /api/user/reminders
// @access  Private
exports.addReminder = async (req, res, next) => {
  try {
    const email = req.user.email;
    const { details, category, time } = req.body;

    const reminder = await TrackerLogs.create({
      userEmail: email,
      category: 'reminder',
      reminder: {
        details,
        type: category, // medication or appointment
        time
      }
    });

    res.status(201).json({ success: true, id: reminder._id });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete reminder
// @route   DELETE /api/user/reminders
// @access  Private
exports.deleteReminder = async (req, res, next) => {
  try {
    const email = req.user.email;
    const id = req.query.id;

    await TrackerLogs.findOneAndDelete({ _id: id, userEmail: email, category: 'reminder' });
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

// @desc    Get diet logs
// @route   GET /api/user/diet-logs
// @access  Private
exports.getDietLogs = async (req, res, next) => {
  try {
    const email = req.user.email;
    const logs = await TrackerLogs.find({ userEmail: email, category: 'diet' }).sort('-createdAt');

    const formatted = logs.map(l => ({
      _id: l._id,
      meal: l.diet.mealName,
      calories: l.diet.calories,
      proteins: l.diet.protein,
      carbs: l.diet.carbs,
      fats: l.diet.fat,
      created_at: l.createdAt
    }));

    res.status(200).json(formatted);
  } catch (err) {
    next(err);
  }
};

// @desc    Add diet meal log
// @route   POST /api/user/diet-logs
// @access  Private
exports.logMeal = async (req, res, next) => {
  try {
    const email = req.user.email;
    const { meal, calories, proteins, carbs, fats } = req.body;

    await TrackerLogs.create({
      userEmail: email,
      category: 'diet',
      diet: {
        mealName: meal,
        calories: calories || 0,
        protein: proteins || 0,
        carbs: carbs || 0,
        fat: fats || 0
      }
    });

    res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
};

// @desc    Get workout logs
// @route   GET /api/user/workout-logs
// @access  Private
exports.getWorkoutLogs = async (req, res, next) => {
  try {
    const email = req.user.email;
    const logs = await TrackerLogs.find({ userEmail: email, category: 'workout' }).sort('-createdAt');

    const formatted = logs.map(l => ({
      _id: l._id,
      exercise: l.workout.workoutName,
      duration: l.workout.duration,
      calories: l.workout.caloriesBurned,
      intensity: l.workout.intensity,
      created_at: l.createdAt
    }));

    res.status(200).json(formatted);
  } catch (err) {
    next(err);
  }
};

// @desc    Log workout
// @route   POST /api/user/workout-logs
// @access  Private
exports.logWorkout = async (req, res, next) => {
  try {
    const email = req.user.email;
    const { exercise, duration, calories, intensity } = req.body;

    await TrackerLogs.create({
      userEmail: email,
      category: 'workout',
      workout: {
        workoutName: exercise,
        duration: duration || 0,
        caloriesBurned: calories || 0,
        intensity: intensity || 'Medium'
      }
    });

    res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
};

// @desc    Get patient list (for doctors)
// @route   GET /api/doctor/patients
// @access  Private (Doctor only)
exports.getPatients = async (req, res, next) => {
  try {
    // Returns all patient users for simulation
    const patients = await User.find({ role: 'patient' });
    res.status(200).json(patients);
  } catch (err) {
    next(err);
  }
};

// @desc    Get specific patient tracker logs (for doctor)
// @route   GET /api/doctor/patient/:email/data
// @access  Private (Doctor only)
exports.getPatientData = async (req, res, next) => {
  try {
    const email = req.params.email;
    const patientUser = await User.findOne({ email, role: 'patient' });

    if (!patientUser) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    const diet = await TrackerLogs.find({ userEmail: email, category: 'diet' }).sort('-createdAt').limit(10);
    const workouts = await TrackerLogs.find({ userEmail: email, category: 'workout' }).sort('-createdAt').limit(10);
    const activities = await TrackerLogs.find({ userEmail: email, category: 'activity' }).sort('-date').limit(7);

    res.status(200).json({
      profile: patientUser,
      diet,
      workouts,
      activities
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get or add doctor notes for patient
// @route   GET/POST /api/doctor/patient/:email/notes
// @access  Private (Doctor only)
exports.patientNotes = async (req, res, next) => {
  try {
    const email = req.params.email;
    if (req.method === 'GET') {
      const notes = await TrackerLogs.find({
        userEmail: email,
        category: 'doctor_note'
      }).sort('-createdAt');
      
      const formatted = notes.map(n => ({
        _id: n._id,
        patient_email: n.userEmail,
        doctor_email: n.doctorNote.doctorEmail,
        notes: n.doctorNote.notes,
        created_at: n.createdAt
      }));
      
      res.status(200).json(formatted);
    } else {
      const { notes } = req.body;
      const note = await TrackerLogs.create({
        userEmail: email,
        category: 'doctor_note',
        doctorNote: {
          doctorEmail: req.user.email,
          notes
        }
      });
      res.status(201).json({ success: true, id: note._id });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Ask AI (AI fitness coach answers)
// @route   POST /api/shared/askAI
// @access  Private
exports.askAI = async (req, res, next) => {
  try {
    const { message } = req.body;
    
    // Custom smart response simulator for AI Health/Fitness coach
    let answer = "I am your AI Coach. I'm analyzing your records. Let me know how I can support your health journey!";
    const msg = message.toLowerCase();
    
    if (msg.includes('diet') || msg.includes('eat') || msg.includes('food')) {
      answer = "For an active health profile, focus on complex carbohydrates, lean proteins (chicken, fish, lentils), and healthy fats (avocados, nuts). Ensure you stay hydrated with at least 2.5L of water daily.";
    } else if (msg.includes('workout') || msg.includes('exercise') || msg.includes('gym')) {
      answer = "A balanced routine combines 3 days of strength training (targeting full body compounds) with 2 days of cardiovascular activity (running, cycling, or swimming). Remember to incorporate stretching for active recovery.";
    } else if (msg.includes('symptom') || msg.includes('pain') || msg.includes('hurt')) {
      answer = "If you're experiencing pain or severe symptoms, it is highly recommended to schedule an appointment with a specialist using our Doctor Booking calendar. Please monitor logs daily.";
    }

    res.status(200).json({ answer });
  } catch (err) {
    next(err);
  }
};

// @desc    Generate daily diet plan via AI
// @route   POST /api/shared/generate-diet-plan
// @access  Private
exports.generateDiet = async (req, res, next) => {
  try {
    const email = req.user.email;
    const today = new Date().toISOString().split('T')[0];

    // Check if diet plan exists
    const existing = await TrackerLogs.findOne({
      userEmail: email,
      category: 'diet',
      date: today
    });

    if (existing) {
      return res.status(200).json(existing);
    }

    // Mock plan data
    const dietPlan = {
      userEmail: email,
      category: 'diet',
      date: today,
      diet: {
        mealName: 'Generated Nutritious Plan: Oatmeal (Breakfast), Grilled Salmon with Quinoa (Lunch), Greek Yogurt (Snack), Baked Chicken Salad (Dinner)',
        calories: 1850,
        protein: 130,
        carbs: 180,
        fat: 55
      }
    };

    const newPlan = await TrackerLogs.create(dietPlan);
    res.status(200).json(newPlan);
  } catch (err) {
    next(err);
  }
};

// @desc    Analyze drug safety checker
// @route   POST /api/shared/analyze-drugs
// @access  Private
exports.analyzeDrugs = async (req, res, next) => {
  try {
    const { drugs } = req.body; // array of strings
    
    // Simulate drug checks
    const interactions = [];
    const risks = [];
    const alternatives = [];

    if (drugs && drugs.length > 1) {
      const lowerDrugs = drugs.map(d => d.trim().toLowerCase());
      
      // Rule 1: Aspirin + Warfarin
      if (lowerDrugs.includes('aspirin') && lowerDrugs.includes('warfarin')) {
        interactions.push("Aspirin + Warfarin: High risk of internal bleeding.");
        risks.push("Co-administration leads to synergy in blood-thinning effects, risking major hemorrhage.");
        alternatives.push("Manage pain with acetaminophen (paracetamol) under supervision.");
      }

      // Rule 2: Ibuprofen + Aspirin
      if (lowerDrugs.includes('ibuprofen') && lowerDrugs.includes('aspirin')) {
        interactions.push("Ibuprofen + Aspirin: Reduced cardioprotective efficacy / increased GI risk.");
        risks.push("Ibuprofen can block the antiplatelet effect of low-dose aspirin, increasing stroke/heart attack hazard.");
        alternatives.push("Space administration by taking aspirin 2 hours before ibuprofen, or consult a cardiologist.");
      }

      // Rule 3: Sildenafil + Nitroglycerin
      if ((lowerDrugs.includes('sildenafil') || lowerDrugs.includes('viagra')) && (lowerDrugs.includes('nitroglycerin') || lowerDrugs.includes('nitro'))) {
        interactions.push("Sildenafil + Nitroglycerin: Severe, potentially fatal hypotension (low blood pressure).");
        risks.push("Nitrates dilate blood vessels; combining with PDE5 inhibitors causes drastic blood pressure drops.");
        alternatives.push("Absolutely contra-indicated. Do not use nitrates within 24-48 hours of PDE5 inhibitors.");
      }

      // Rule 4: Lisinopril + Potassium
      if (lowerDrugs.includes('lisinopril') && (lowerDrugs.includes('potassium') || lowerDrugs.includes('k-dur'))) {
        interactions.push("Lisinopril + Potassium: Risk of severe hyperkalemia.");
        risks.push("ACE inhibitors reduce potassium excretion. Supplemental potassium raises blood potassium levels to dangerous levels.");
        alternatives.push("Avoid potassium supplements or salt substitutes containing potassium without monitoring.");
      }

      // Rule 5: Simvastatin + Grapefruit Juice
      if (lowerDrugs.includes('simvastatin') && (lowerDrugs.includes('grapefruit') || lowerDrugs.includes('grapefruit juice'))) {
        interactions.push("Simvastatin + Grapefruit Juice: Risk of statin toxicity.");
        risks.push("Grapefruit inhibits CYP3A4 enzymes, increasing simvastatin concentration and risking muscle damage (rhabdomyolysis).");
        alternatives.push("Avoid consuming grapefruit products while taking Simvastatin. Ask about alternative statins (e.g., Rosuvastatin).");
      }

      // Rule 6: Xanax + Alcohol
      if ((lowerDrugs.includes('xanax') || lowerDrugs.includes('alprazolam')) && (lowerDrugs.includes('alcohol') || lowerDrugs.includes('ethanol') || lowerDrugs.includes('beer') || lowerDrugs.includes('wine'))) {
        interactions.push("Alprazolam (Xanax) + Alcohol: Extreme CNS and respiratory depression.");
        risks.push("Synergistic sedative effects can lead to severe drowsiness, loss of motor control, breathing arrest, or coma.");
        alternatives.push("Strictly avoid alcohol consumption while taking any benzodiazepine medications.");
      }
    }

    res.status(200).json({
      interactions: interactions.length > 0 ? interactions : ["No serious interactions found for the selected drugs."],
      risks: risks.length > 0 ? risks : ["General caution advised. Consult your physician."],
      alternatives: alternatives.length > 0 ? alternatives : ["Consult your pharmacist for alternative medications."]
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Log symptoms checker
// @route   POST /api/shared/symptoms
// @access  Private
exports.checkSymptoms = async (req, res, next) => {
  try {
    const email = req.user.email;
    const { symptoms, severity, duration, notes, vitals } = req.body;

    const logged = await TrackerLogs.create({
      userEmail: email,
      category: 'symptom',
      symptom: {
        symptomsList: symptoms || [],
        severity: severity || 5,
        duration: duration || '1 day',
        notes: notes || '',
        vitals: vitals || {}
      }
    });

    res.status(201).json({ success: true, message: 'Symptoms logged successfully', data: logged });
  } catch (err) {
    next(err);
  }
};

// @desc    Get weekly activity history logs
// @route   GET /api/user/activities/weekly
// @access  Private
exports.getWeeklyActivities = async (req, res, next) => {
  try {
    const email = req.user.email;
    const TrackerLogs = require('../models/TrackerLogs');
    
    // Past 7 days
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }

    const logs = await TrackerLogs.find({
      userEmail: email,
      category: 'activity',
      date: { $in: dates }
    });

    const result = dates.map(date => {
      const log = logs.find(l => l.date === date);
      return {
        date,
        water: log ? (log.activity.waterIntake || 0) : 0,
        sleep: log ? (log.activity.sleepDuration || 0) : 0,
        calories: log ? (log.activity.caloriesTarget || 0) : 0
      };
    });

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
