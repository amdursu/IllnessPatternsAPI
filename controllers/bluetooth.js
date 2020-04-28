module.exports = {
    insertPatientData: (patientData) => {
        let query1 = `INSERT INTO patient_data (patient_id, age, heart_rate, blood_pressure, weight, height, date) VALUES 
                  (${patientData.patientID}, ${Number(patientData.age)}, ${Number(patientData.heartRate)}, '${patientData.systolic}/${patientData.diastolic}', 
                  ${Number(patientData.weight)}, ${Number(patientData.height)}, NOW());`;
        db.query(query1, (error, results, fields) => {
            if(error) throw error;
            let patientDataID = results.insertId;
            for(let symptom of patientData.symptoms){
                let query2 = `INSERT INTO symptoms (patient_data_id, name) VALUES (${patientDataID}, '${symptom}')`;
                db.query(query2, (err, res) => {
                    if(err) throw err;
                })
            }
            for(let disease of patientData.diseases){
                let query3 = `INSERT INTO diseases (patient_data_id, name) VALUES (${patientDataID}, '${disease}')`;
                db.query(query3, (err, res) => {
                    if(err) throw err;
                })
            }
        })
    }
}