# AI powered Online Banking System
### Tech stack - Next.Js + Flask

## Setup steps

```bash
git clone git@github.com:NormieNoob/Banking_Management_system.git
```

* Setup the backend

```bash
cd backend
touch .env
pip install -r requirements.txt
```

* Type the following command to run the backend server

```bash
python app.py
```


* Open new terminal & type the following commands

```bash
cd ../frontend
touch .env
npm install
```

* Get the api key for gemini & paste it in the .env file


```
#frontend/.env
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key
```

```bash
npn run dev
```

## Screenshots

* Home page -
![img.png](screenshots/img.png)


* Signup - 
![img_1.png](screenshots/img_1.png)


* Login -
![img_2.png](screenshots/img_2.png)


* Dashboard -
![img_3.png](screenshots/img_3.png)


* Balance & transaction history -
![img_4.png](screenshots/img_4.png)


* Fund transfer -
![img_5.png](screenshots/img_5.png)


* eposit -
![img_6.png](screenshots/img_6.png)


* Withdraw -
![img_7.png](screenshots/img_7.png)


* Ai Assistant -
![img_8.png](screenshots/img_8.png)
