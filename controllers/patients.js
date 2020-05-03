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
        let query = `SELECT p.id, p.age, p.heart_rate, p.blood_pressure, p.weight, p.height, p.date, p.given_diagnosis, CONCAT(u.firstname, ' ', u.surname) as name 
                    FROM patient_data p JOIN users u ON p.patient_id = u.id WHERE p.patient_id = ${req.query.id};`;
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
                    name: patientData.name,
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
    },

    patientSearch: (req, res, next) => {
        let { filters } = req.body;
        let query = 'SELECT id, age, heart_rate, blood_pressure, weight, height, date, given_diagnosis FROM patient_data ';
        let i = 0;
        filters.forEach(filter => {
            let f = filter.split(':');
            if(f[0] == 'HR'){
                let hr = Number(f[1]);
                if(i == 0){
                    query += `WHERE (heart_rate BETWEEN ${hr - 10} AND ${hr + 10}) `;
                    i++;
                } else {
                    query += `AND (heart_rate BETWEEN ${hr - 10} AND ${hr + 10}) `;
                    i++;
                }
            } else if(f[0] == 'S'){
                let systolic = filter.split('/')[0];
                let diastolic = filter.split('/')[1];
                let s = Number(systolic.split(':')[1]);
                let d = Number(diastolic.split(':')[1]);
                if(i == 0){
                    query += `WHERE ((CONVERT(SUBSTRING(blood_pressure, 1, 3), SIGNED) BETWEEN ${s - 10} AND ${s + 10}) AND (CONVERT(SUBSTRING(blood_pressure, 5, 2), SIGNED) BETWEEN ${d - 10} AND ${d + 10})) `;
                    i++;
                } else {
                    query += `AND ((CONVERT(SUBSTRING(blood_pressure, 1, 3), SIGNED) BETWEEN ${s - 10} AND ${s + 10}) AND (CONVERT(SUBSTRING(blood_pressure, 5, 2), SIGNED) BETWEEN ${d - 10} AND ${d + 10})) `;
                    i++;
                }
            } else if(f[0] == 'W'){
                let w = Number(f[1]);
                if(i == 0){
                    query += `WHERE (weight BETWEEN ${w - 10} AND ${w + 10}) `;
                    i++;
                } else {
                    query += `AND (weight BETWEEN ${w - 10} AND ${w + 10}) `;
                    i++;
                }
            }
        });

        query += 'AND given_diagnosis IS NOT NULL;'
        db.query(query, async (err, response) => {
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
    }
}