# bite2024
 24h Hackathon at IST 23th Mar & 24th Mar 2024 by Best Lisbon with [@eXezon](https://github.com/eXezon) and [@Fytex](https://github.com/Fytex)

## PT - :portugal:
### Testar

O projeto utiliza MongoDB para a base de dados. Para uma melhor experiência fornecemos 3 ficheiros JSON (na pasta `populate_db`) que correspondem às 3 collections que a constituem. Deverá ser criada uma database `bite2024` e 3 collections `learn`, `quizzes`, `users`. Os dados que as populam estão nos ficheiros `bite2024.learn.json`, `bite2024.quizzes.json`, `bite2024.users.json` respetivamente.

O utilizador de testes tem o email `test@test.test` e a password é `test`.

Para inicializar o backend:
```bash
cd backend
pip install -r requirements.txt
python app.py
```

Para inicializar o frontend:
```bash
cd frontend
npm i
npm start
```
## EN - :uk:
### Testing
The project uses MongoDB for the database. For a better experience, we provide 3 JSON files (in the `populate_db` folder) corresponding to the 3 collections that compose it. You should create a database named `bite2024` and 3 collections named `learn`, `quizzes`, `users`. The data to populate them is in the files `bite2024.learn.json`, `bite2024.quizzes.json`, `bite2024.users.json` respectively.

The test user has the email `test@test.test` and the password is `test`.

To initialize the backend:
```bash
cd backend
pip install -r requirements.txt
python app.py
```

To initialize the frontend:
```bash
cd frontend
npm i
npm start
```