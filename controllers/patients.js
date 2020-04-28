function getSymptomsAndDiseases(id){
    return new Promise((resolve, reject) => {
        let query2 = `SELECT name FROM diseases WHERE patient_data_id = ${id}; SELECT name FROM symptoms WHERE patient_data_id = ${id};`;
        console.log(query2);
        
        db.query(query2, (err, response) => {
            if(err){
                reject(err);
            }
            resolve({ diseases: response[0], symptoms: response[1]});
        })
    })
}

function formatDate(date){
    date = date.toISOString().split('T')[0].split('-');
    let day = date[2];
    let month = date[1];
    let year = date[0];
    return `${day}.${month}.${year}`;
}

module.exports = {
    getPatients: (req, res, next) => {
        let query = `SELECT id, surname, firstname, email FROM users WHERE admin = 0;`;
        db.query(query, (err, response) => {
            if(err){
                res.status(500).send({err});
                return;
            }
            let patients = [];
            response.forEach(patient => {
                patients.push({
                    id: patient.id,
                    surname: patient.surname,
                    firstname: patient.firstname,
                    email: patient.email
                });
            });
            res.status(200).send(patients);
        });
    },

    getPatient: (req, res, next) => {
        let query = `SELECT id, age, heart_rate, blood_pressure, weight, height, date, given_diagnosis FROM patient_data WHERE patient_id = ${req.query.id};`;
        db.query(query, async (err, response) => {
            if(err){
                res.status(500).send({err});
                return;
            }
            let allPatientData = [];
            for(let patientData of response) {
                let result = await getSymptomsAndDiseases(patientData.id);
                allPatientData.push({
                    id: patientData.id,
                    age: patientData.age,
                    heartRate: patientData.heart_rate,
                    bloodPressure: patientData.blood_pressure,
                    weight: patientData.weight,
                    height: patientData.height,
                    date: formatDate(new Date(patientData.date)),
                    givenDiagnosis: patientData.given_diagnosis,
                    diseases: result.diseases,
                    symptoms: result.symptoms
                })
            }
            res.status(200).send(allPatientData);
        })
    },

    sendDiagnosis: (req, res, next) => {
        let { id, diagnosis } = req.body;
        let query = `UPDATE patient_data SET given_diagnosis = '${diagnosis}' WHERE id = ${id};`;
        db.query(query, (err, response) => {
            if(err){
                res.status(500).send({err});
                return;
            }
            res.status(200).send();
        })
    }
}