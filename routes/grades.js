const express = require('express');
const fs = require('fs').promises;

const router = express.Router();

// Crie um endpoint para criar uma grade.
// Este endpoint deverá receber como parâmetros os campos student, subject, type e value conforme descritos acima.
// Essa grade deverá ser salva no arquivo json grades.json, e deverá ter um id único associado.
// No campo timestamp deverá ser salvo a data e hora do momento da inserção.
// O endpoint deverá retornar o objeto da grade que foi criada.
// A API deverá garantir o incremento automático desse identificador, de forma que ele não se repita entre os registros.
// Dentro do arquivo grades.json que foi fornecido para utilização no desafio, o campo nextId já está com um valor definido.
// Após a inserção é preciso que esse nextId seja incrementado e salvo no próprio arquivo, de forma que na próxima inserção ele possa ser utilizado.
router.post('/', async (req, res) => {
  let newGrade = req.body;

  try {
    let data = await fs.readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);

    grade = { id: json.nextId++, ...newGrade };
    json.grades.push(grade);

    await fs.writeFile(global.fileName, JSON.stringify(json));

    res.end();

    logger.info(`POST /grade - ${JSON.stringify(grade)}`);
  } catch (err) {
    res.status(400).send({ erro: err.message });
    logger.error(`POST /grade - ${err.message}`);
  }
});

// Crie um endpoint para atualizar uma grade.
// Esse endpoint deverá receber como parâmetros o id da grade a ser alterada e os campos student, subject, type e value.
// O endpoint deverá validar se a grade informada existe, caso não exista deverá retornar um erro.
// Caso exista, o endpoint deverá atualizar as informações recebidas por parâmetros no registro, e realizar sua atualização com os novos dados alterados no arquivo grades.json.
router.put('/', async (req, res) => {
  try {
    let newGrade = req.body;
    let data = await fs.readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    let oldIndex = json.grades.findIndex((grade) => grade.id === newGrade.id);

    json.grades[oldIndex].student = newGrade.student;
    json.grades[oldIndex].subject = newGrade.subject;
    json.grades[oldIndex].type = newGrade.type;
    json.grades[oldIndex].value = newGrade.value;

    await fs.writeFile(global.fileName, JSON.stringify(json));

    res.end();
    logger.info(`PUT /grade - ${JSON.stringify(newGrade)}`);
  } catch (err) {
    res.status(400).send({ erro: err.message });
    logger.info(`PUT /grade - ${err.message}`);
  }
});

// rie um endpoint para excluir uma grade.
// Esse endpoint deverá receber como parâmetro o id da grade e realizar sua exclusão do arquivo grades.json.
router.delete('/:id', async (req, res) => {
  try {
    let data = await fs.readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);

    const grades = json.grades.filter(
      (grade) => grade.id !== parseInt(req.params.id, 10)
    );
    json.grades = grades;

    await fs.writeFile(global.fileName, JSON.stringify(json));
    res.end();
    logger.info(`DELETE /grade/:id - ${req.params.id}`);
  } catch (err) {
    res.status(400).send({ erro: err.message });
    logger.info(`DELETE /grade - ${err.message}`);
  }
});

// Crie um endpoint para consultar uma grade em específico.
// Esse endpoint deverá receber como parâmetro o id da grade e retornar suas informações.
router.get('/:id', async (req, res) => {
  try {
    let data = await fs.readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);

    const grade = json.grades.find(
      (grade) => grade.id === parseInt(req.params.id, 10)
    );

    if (grade) {
      res.send(grade);
      logger.info(`GET /grade/:id - ${JSON.stringify(grade)}`);
    } else {
      res.end();
      logger.info(`GET /grade/:id`);
    }
  } catch (err) {
    res.status(400).send({ erro: err.message });
    logger.error(`GET /grade/:id`);
  }
});

// Crie um endpoint para consultar a nota total de um aluno em uma disciplina.
// O endpoint deverá receber como parâmetro o student e o subject, e realizar a soma de todas as notas de atividades correspondentes àquele subject, para aquele student.
// O endpoint deverá retornar a soma da propriedade value dos registros encontrados.
router.post('/total', async (req, res) => {
  try {
    let params = req.body;
    let data = await fs.readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    const grades = json.grades.filter(
      (grade) =>
        grade.student === params.student && grade.subject === params.subject
    );
    let sumGrades = grades
      .map((item) => item.value)
      .reduce((prev, curr) => prev + curr, 0);

    res.send(
      `Aluno ${params.student} - Disciplina ${params.subject}: Nota ${sumGrades}`
    );
    logger.info(`POST /grade/total - ${sumGrades}`);
  } catch (err) {
    res.status(400).send({ erro: err.message });
    logger.info(`POST /grade/total - ${err.message}`);
  }
});

// Crie um endpoint para consultar a média das grades de determinado subject e type.
// O endpoint deverá receber como parâmetro um subject e um type, e retornar a média.
// A média é calculada somando o registro value de todos os registros que possuem o subject e type informados, dividindo pelo total de registros que possuem este mesmo subject e type.
router.post('/average', async (req, res) => {
  try {
    let params = req.body;
    let data = await fs.readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    const grades = json.grades.filter(
      (grade) => grade.subject === params.subject && grade.type === params.type
    );
    let sumGrades = grades
      .map((item) => item.value)
      .reduce((prev, curr) => prev + curr, 0);

    let averageGrade = sumGrades / grades.length;

    res.send(
      `A Disciplina ${params.subject} do tipo ${params.type}, possui a média ${averageGrade}`
    );
    logger.info(`POST /grade/average - ${averageGrade}`);
  } catch (err) {
    res.status(400).send({ erro: err.message });
    logger.info(`POST /grade/average - ${err.message}`);
  }
});

// Crie um endpoint para retornar as três melhores grades de acordo com determinado subject e type.
// O endpoint deve receber como parâmetro um subject e um type, e retornar um array com os três registros de maior value daquele subject e type.
// A ordem deve ser do maior para o menor.
router.post('/top', async (req, res) => {
  try {
    let params = req.body;
    let data = await fs.readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    delete json.nextId;
    const grades = json.grades.filter(
      (grade) => grade.subject === params.subject && grade.type === params.type
    );

    let topGrades = grades.sort((a, b) => b.value - a.value).slice(0, 3);

    res.send(topGrades);
    logger.info(`POST /grade/top - ${JSON.stringify(topGrades)}`);
  } catch (err) {
    res.status(400).send({ erro: err.message });
    logger.info(`POST /grade/top - ${err.message}`);
  }
});

module.exports = router;
