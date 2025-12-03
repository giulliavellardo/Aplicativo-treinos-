# fitlog.py
import json
import os
from datetime import datetime

EX_FILE = "exercicios.json"
REG_FILE = "registros.json"

# ---------------------------
# Helpers para gravar/ler json
# ---------------------------
def load_json(path, default):
    if not os.path.exists(path):
        return default
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default

def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# ---------------------------
# Estruturas iniciais
# ---------------------------
exercicios = load_json(EX_FILE, [])   # lista de { "nome":..., "grupo":..., "obs":... }
registros = load_json(REG_FILE, {})   # dicionário por data: "YYYY-MM-DD": { "feitos":[...], "tempo":..., "nota":... }

# ---------------------------
# Funções de exercicios
# ---------------------------
def cadastrar_exercicio():
    print("\n--- Cadastrar novo exercício/aparelho ---")
    nome = input("Nome do exercício/aparelho: ").strip()
    if not nome:
        print("Nome vazio. Cancelando.")
        return
    grupo = input("Grupo muscular (ex: Pernas, Peito, Costas): ").strip()
    obs = input("Observações (ajuste/execução/dor): ").strip()
    exercicios.append({"nome": nome, "grupo": grupo, "obs": obs})
    save_json(EX_FILE, exercicios)
    print(f"✔️ Exercício '{nome}' cadastrado.")

def listar_exercicios():
    if not exercicios:
        print("\nNenhum exercício cadastrado ainda.\n")
        return
    print("\n--- EXERCÍCIOS CADASTRADOS ---")
    for i, ex in enumerate(exercicios, 1):
        obs = ex.get("obs", "")
        grupo = ex.get("grupo", "")
        print(f"{i}. {ex['nome']}  |  Grupo: {grupo}  |  Obs: {obs}")
    print()

def remover_exercicio():
    listar_exercicios()
    if not exercicios:
        return
    try:
        n = int(input("Digite o número do exercício para remover (0 cancela): "))
    except ValueError:
        print("Entrada inválida.")
        return
    if n == 0:
        return
    if 1 <= n <= len(exercicios):
        ex = exercicios.pop(n-1)
        save_json(EX_FILE, exercicios)
        print(f"🗑️  Exercício '{ex['nome']}' removido.")
    else:
        print("Número inválido.")

# ---------------------------
# Funções de registro diário
# ---------------------------
def hoje_str():
    return datetime.now().strftime("%Y-%m-%d")

def iniciar_checklist():
    if not exercicios:
        print("\nCadastre exercícios primeiro (opção 1).\n")
        return

    data = input(f"Data do registro (YYYY-MM-DD) [padrão: {hoje_str()}]: ").strip()
    if data == "":
        data = hoje_str()

    # garante estrutura inicial para a data
    registro = registros.get(data, {"feitos": [], "tempo": "", "nota": ""})
    feitos = set(registro.get("feitos", []))

    while True:
        print(f"\n--- Checklist: {data} ---")
        # mostra lista com checkbox
        for i, ex in enumerate(exercicios, 1):
            marcador = "✅" if ex["nome"] in feitos else "⬜"
            print(f"{i}. {marcador} {ex['nome']}  ({ex.get('grupo','')})")
        print("\nAções:")
        print(" [número] - alterna check (marca/desmarca)")
        print(" t - informar tempo total do treino (minutos)")
        print(" a - adicionar anotação do dia")
        print(" s - salvar e voltar ao menu")
        print(" q - cancelar sem salvar\n")

        cmd = input("Escolha uma ação: ").strip().lower()
        if cmd == "s":
            # salvar
            registro["feitos"] = list(feitos)
            if registro.get("tempo") is None:
                registro["tempo"] = ""
            registros[data] = registro
            save_json(REG_FILE, registros)
            print("✔️ Registro salvo.")
            return
        if cmd == "q":
            print("Cancelado. Nenhuma mudança foi salva.")
            return
        if cmd == "t":
            tempo = input("Tempo total do treino (em minutos): ").strip()
            registro["tempo"] = tempo
            print("Tempo salvo.")
            continue
        if cmd == "a":
            nota = input("Escreva sua anotação sobre o treino: ").strip()
            registro["nota"] = nota
            print("Anotação salva.")
            continue
        # tenta interpretar como número
        try:
            idx = int(cmd)
            if 1 <= idx <= len(exercicios):
                nome = exercicios[idx-1]["nome"]
                if nome in feitos:
                    feitos.remove(nome)
                    print(f"✖️ Desmarcado: {nome}")
                else:
                    feitos.add(nome)
                    print(f"✅ Marcado: {nome}")
            else:
                print("Número fora do intervalo.")
        except ValueError:
            print("Comando inválido.")

def ver_registro_data():
    data = input(f"Data que deseja ver (YYYY-MM-DD) [padrão: {hoje_str()}]: ").strip()
    if data == "":
        data = hoje_str()
    registro = registros.get(data)
    if not registro:
        print(f"\nNenhum registro para {data}.\n")
        return
    print(f"\n=== Registro de {data} ===")
    feitos = registro.get("feitos", [])
    if feitos:
        print("Exercícios marcados:")
        for ex in feitos:
            print(" -", ex)
    else:
        print("Nenhum exercício marcado.")
    tempo = registro.get("tempo", "")
    nota = registro.get("nota", "")
    print("Tempo (min):", tempo if tempo else "-")
    print("Anotação:", nota if nota else "-")
    print()

def ver_historico_lista():
    if not registros:
        print("\nNenhum registro salvo ainda.\n")
        return
    datas = sorted(registros.keys(), reverse=True)
    print("\n=== Históricos por dia (mais recente primeiro) ===")
    for d in datas:
        reg = registros[d]
        feitos = reg.get("feitos", [])
        resumo = f"{len(feitos)} ex" if feitos else "0 ex"
        nota = reg.get("nota", "")
        print(f"{d} — {resumo} — nota: {nota[:30] + ('...' if len(nota)>30 else '')}")
    print()

# ---------------------------
# Menu principal
# ---------------------------
def menu():
    while True:
        print("\n======== FIT LOG ========")
        print("1. Cadastrar novo exercício/aparelho")
        print("2. Ver exercícios cadastrados")
        print("3. Remover exercício")
        print("4. Registrar treino / Checklist do dia")
        print("5. Ver registro de uma data")
        print("6. Ver histórico resumido")
        print("7. Exportar registros para arquivo .json (backup)")
        print("8. Sair")
        opc = input("Escolha uma opção: ").strip()

        if opc == "1":
            cadastrar_exercicio()
        elif opc == "2":
            listar_exercicios()
        elif opc == "3":
            remover_exercicio()
        elif opc == "4":
            iniciar_checklist()
        elif opc == "5":
            ver_registro_data()
        elif opc == "6":
            ver_historico_lista()
        elif opc == "7":
            nome = input("Nome do arquivo de backup (ex: backup.json): ").strip()
            if not nome:
                nome = f"backup_{hoje_str()}.json"
            save_json(nome, registros)
            print(f"Backup salvo em {nome}")
        elif opc == "8":
            print("Até o próximo treino! 💛")
            break
        else:
            print("Opção inválida. Tente novamente.")

if __name__ == "__main__":
    print("FitLog — iniciando...")
    menu()
