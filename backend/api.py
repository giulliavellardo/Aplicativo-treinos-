from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fitlog import exercicios, registros, save_json, EX_FILE, REG_FILE, hoje_str

app = FastAPI()

# permitir que o frontend (html/js) acesse a API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------
# Rotas da API
# ---------------------------

@app.get("/exercicios")
def get_exercicios():
    return exercicios


@app.post("/exercicios")
def add_exercicio(item: dict):
    exercicios.append(item)
    save_json(EX_FILE, exercicios)
    return {"status": "ok"}


@app.get("/registros")
def get_registros():
    return registros


@app.get("/registros/{data}")
def get_registro(data: str):
    return registros.get(data, {})


@app.post("/registros/{data}")
def salvar_registro(data: str, body: dict):
    registros[data] = body
    save_json(REG_FILE, registros)
    return {"status": "salvo"}
