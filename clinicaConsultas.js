const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let pacientesCadastrados = [];
let agendamentos = [];

const carregarDados = () => {
  try {
    const data = fs.readFileSync("./bancoDeDados.json");
    const salvarDados = JSON.parse(data);
    pacientesCadastrados = salvarDados.pacientes || [];
    agendamentos = salvarDados.agendamentos || [];
  } catch (error) {
    pacientesCadastrados = [];
    agendamentos = [];
  }
};
carregarDados();

const salvarDados = () => {
  try {
    const data = JSON.stringify({
      pacientes: pacientesCadastrados,
      agendamentos,
    });
    fs.writeFileSync("./bancoDeDados.json", data);
  } catch (error) {
    console.error();
  }
};

const cadastrarPaciente = () => {
  rl.question("\nDigite o nome do paciente: ", (nome) => {
    rl.question("Digite o telefone do paciente: ", (telefone) => {
      const pacienteExistente = pacientesCadastrados.find(
        (paciente) => paciente.telefone === telefone
      );
      if (pacienteExistente) {
        console.clear();
        console.log("\nPaciente já cadastrado!");
        exibirMenu();
        return;
      }
      const paciente = {
        nome,
        telefone,
      };
      pacientesCadastrados.push(paciente);
      console.clear();
      console.log("**Paciente cadastrado com sucesso**");
      salvarDados();
      exibirMenu();
    });
  });
};

const marcarConsulta = () => {
  console.clear();
  console.log("\nLista de Pacientes Cadastrados:");
  pacientesCadastrados.forEach((paciente, index) => {
    console.log(`${index + 1}. ${paciente.nome}`);
  });

  rl.question(
    "\nEscolha o número do paciente para agendar consulta: ",
    (numeroPaciente) => {
      const paciente = pacientesCadastrados[parseInt(numeroPaciente) - 1];

      if (!paciente) {
        console.clear();
        console.log("\nNúmero de paciente não existe");
        exibirMenu();
        return;
      }

      rl.question("\nDigite o dia e o mês da consulta (dd/MM): ", (dia) => {
        rl.question("Digite a hora da consulta (hh:mm): ", (hora) => {
          rl.question("Digite a especialidade desejada: ", (especialidade) => {
            const agendamento = {
              paciente,
              dia,
              hora,
              especialidade,
            };
            const consultaJaAgendada = agendamentos.find(
              (dataConsulta) =>
                dataConsulta.dia === dia && dataConsulta.hora === hora
            );
            if (consultaJaAgendada) {
              console.clear();
              console.log(
                "\nJá existe um paciente agendado pra esse dia e hora!"
              );
              exibirMenu();
              return;
            }
            agendamentos.push(agendamento);
            console.clear();
            console.log("\n**Consulta marcada com sucesso**");
            salvarDados();
            exibirMenu();
          });
        });
      });
    }
  );
};

const listarConsultas = () => {
  console.clear();
  console.log("\nLista de Consultas Agendadas:\n");
  agendamentos.forEach((agendamento, index) => {
    console.log(
      `${index + 1}. Paciente: ${agendamento.paciente.nome}, Data: ${
        agendamento.dia
      }, Hora: ${agendamento.hora}, Especialidade: ${agendamento.especialidade}`
    );
  });

  exibirMenu();
};

const cancelarConsulta = () => {
  console.clear();
  console.log("\nLista de Consultas Agendadas:\n");
  agendamentos.forEach((agendamento, index) => {
    console.log(
      `${index + 1}. Paciente: ${agendamento.paciente.nome}, Data: ${
        agendamento.dia
      }, Hora: ${agendamento.hora}, Especialidade: ${agendamento.especialidade}`
    );
  });

  rl.question(
    "\nEscolha o número da consulta para cancelar: ",
    (numeroConsulta) => {
      const consultaSelecionada = agendamentos[parseInt(numeroConsulta) - 1];

      if (!consultaSelecionada) {
        console.clear();
        console.log("\nNúmero de consulta não existe.");
        exibirMenu();
        return;
      }

      console.log(
        `Consulta agendada: Paciente - ${consultaSelecionada.paciente.nome}, Data - ${consultaSelecionada.dia}, Hora - ${consultaSelecionada.hora}, Especialidade - ${consultaSelecionada.especialidade}`
      );

      rl.question(
        "\nDeseja realmente cancelar esta consulta? (S/N): ",
        (confirmacao) => {
          if (confirmacao.toUpperCase() === "S") {
            agendamentos.splice(agendamentos.indexOf(consultaSelecionada), 1);
            console.clear();
            console.log("\n**Consulta cancelada com sucesso**");
          } else {
            console.clear();
            console.log("**Cancelamento de consulta abortado**");
          }
          salvarDados();
          exibirMenu();
        }
      );
    }
  );
};

const exibirMenu = () => {
  console.log();
  console.log("-----------------------------------");
  console.log("-----Clínica de consultas Ágil-----");
  console.log("-----------------------------------");
  console.log("\nMenu Principal:");
  console.log("1. Cadastrar Paciente");
  console.log("2. Marcar Consulta");
  console.log("3. Listar todas as Consulta");
  console.log("4. Cancelar Consulta");
  console.log("5. Sair");

  rl.question("Escolha uma opção: ", (opcao) => {
    switch (opcao) {
      case "1":
        cadastrarPaciente();
        break;
      case "2":
        marcarConsulta();
        break;
      case "3":
        listarConsultas();
        break;
      case "4":
        cancelarConsulta();
        break;
      case "5":
        console.log("\nPrograma finalizado. Volte Sempre!");
        rl.close();
        break;
      default:
        console.clear();
        console.log("\nOpção inválida. Tente novamente.");
        exibirMenu();
        break;
    }
  });
};
exibirMenu();
