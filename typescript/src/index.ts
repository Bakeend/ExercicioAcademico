import * as fs from 'fs';
import * as readline from 'readline';

interface Aluno {
  nome: string;
  serie: string;
  faltas: number;
  materias: {
    matematica: number[];
    portugues: number[];
    geografia: number[];
    historia: number[];
    quimica: number[];
  };
}

class SistemaEscolar {
  private rl: readline.Interface;
  private alunos: Aluno[] = [];

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  private fazerPergunta(pergunta: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(pergunta, resolve);
    });
  }

  private calcularMedia(notas: number[]): number {
    const soma = notas.reduce((acc, nota) => acc + nota, 0);
    return soma / notas.length;
  }

  private verificarAprovacao(aluno: Aluno): { aprovado: boolean; motivo: string } {
    const frequenciaMinima = 75;
    const notaMinima = 7.0;
    const totalAulas = 100;
    
    const frequencia = ((totalAulas - aluno.faltas) / totalAulas) * 100;
    
    if (frequencia < frequenciaMinima) {
      return { aprovado: false, motivo: `Frequência insuficiente: ${frequencia.toFixed(1)}%` };
    }

    const materias = Object.entries(aluno.materias);
    for (const [materia, notas] of materias) {
      const media = this.calcularMedia(notas);
      if (media < notaMinima) {
        return { aprovado: false, motivo: `Média insuficiente em ${materia}: ${media.toFixed(1)}` };
      }
    }

    return { aprovado: true, motivo: 'Aprovado em todas as matérias e frequência adequada' };
  }

  private gerarBoletim(aluno: Aluno, resultado: { aprovado: boolean; motivo: string }): string {
    const frequencia = ((100 - aluno.faltas) / 100) * 100;
    
    let boletim = `BOLETIM ESCOLAR\n`;
    boletim += `================\n\n`;
    boletim += `Aluno: ${aluno.nome}\n`;
    boletim += `Série: ${aluno.serie}\n`;
    boletim += `Faltas: ${aluno.faltas}\n`;
    boletim += `Frequência: ${frequencia.toFixed(1)}%\n\n`;
    
    boletim += `NOTAS POR MATÉRIA:\n`;
    boletim += `==================\n`;
    
    Object.entries(aluno.materias).forEach(([materia, notas]) => {
      const media = this.calcularMedia(notas);
      boletim += `${materia.toUpperCase()}:\n`;
      boletim += `  Notas: ${notas.join(', ')}\n`;
      boletim += `  Média: ${media.toFixed(1)} ${media >= 7.0 ? '✓' : '✗'}\n\n`;
    });
    
    boletim += `RESULTADO FINAL:\n`;
    boletim += `================\n`;
    boletim += `Status: ${resultado.aprovado ? 'APROVADO' : 'REPROVADO'}\n`;
    boletim += `Motivo: ${resultado.motivo}\n`;
    
    return boletim;
  }

  async coletarNotas(materia: string): Promise<number[]> {
    const notas: number[] = [];
    
    console.log(`\nColetando notas de ${materia}:`);
    for (let i = 1; i <= 8; i++) {
      while (true) {
        const notaStr = await this.fazerPergunta(`Nota ${i} (0-10): `);
        const nota = parseFloat(notaStr);
        
        if (isNaN(nota) || nota < 0 || nota > 10) {
          console.log('Por favor, digite uma nota válida entre 0 e 10.');
        } else {
          notas.push(nota);
          break;
        }
      }
    }
    
    return notas;
  }

  async cadastrarAluno(): Promise<void> {
    console.log('\n=== CADASTRO DE ALUNO ===\n');

    const nome = await this.fazerPergunta('Nome do aluno: ');
    const serie = await this.fazerPergunta('Série do aluno: ');

    let faltas: number;
    while (true) {
      const faltasStr = await this.fazerPergunta('Número de faltas: ');
      faltas = parseInt(faltasStr);
      
      if (isNaN(faltas) || faltas < 0 || faltas > 100) {
        console.log('Por favor, digite um número válido de faltas (0-100).');
      } else {
        break;
      }
    }

    console.log('\n--- Coletando notas das matérias ---');
    const matematica = await this.coletarNotas('Matemática');
    const portugues = await this.coletarNotas('Português');
    const geografia = await this.coletarNotas('Geografia');
    const historia = await this.coletarNotas('História');
    const quimica = await this.coletarNotas('Química');

    const aluno: Aluno = {
      nome,
      serie,
      faltas,
      materias: {
        matematica,
        portugues,
        geografia,
        historia,
        quimica
      }
    };

    this.alunos.push(aluno);
    
    const resultado = this.verificarAprovacao(aluno);
    const boletim = this.gerarBoletim(aluno, resultado);
    
    const nomeArquivo = `boletim_${nome.replace(/\s+/g, '_')}.txt`;
    fs.writeFileSync(nomeArquivo, boletim, 'utf8');
    
    this.salvarAlunoCSV(aluno, resultado);
    
    console.log(`\n✅ Boletim gerado com sucesso: ${nomeArquivo}`);
    console.log(`✅ Dados do aluno salvos em alunos.csv`);
    console.log(`\n${boletim}`);
  }

  private salvarAlunoCSV(aluno: Aluno, resultado: { aprovado: boolean; motivo: string }): void {
    const cabecalho = 'Nome,Série,Faltas,Aprovado,Motivo,MediaMatematica,MediaPortugues,MediaGeografia,MediaHistoria,MediaQuimica\n';
    const dadosCSV = `"${aluno.nome}","${aluno.serie}",${aluno.faltas},${resultado.aprovado ? 'Sim' : 'Não'},"${resultado.motivo}",${this.calcularMedia(aluno.materias.matematica).toFixed(1)},${this.calcularMedia(aluno.materias.portugues).toFixed(1)},${this.calcularMedia(aluno.materias.geografia).toFixed(1)},${this.calcularMedia(aluno.materias.historia).toFixed(1)},${this.calcularMedia(aluno.materias.quimica).toFixed(1)}\n`;

    if (!fs.existsSync('alunos.csv')) {
      fs.writeFileSync('alunos.csv', cabecalho, 'utf8');
    }
    
    fs.appendFileSync('alunos.csv', dadosCSV, 'utf8');
  }

  async menuPrincipal(): Promise<void> {
    while (true) {
      console.log('\n=== SISTEMA ESCOLAR ===');
      console.log('1. Cadastrar novo aluno');
      console.log('2. Sair');
      
      const opcao = await this.fazerPergunta('\nEscolha uma opção: ');
      
      switch (opcao) {
        case '1':
          await this.cadastrarAluno();
          break;
        case '2':
          console.log('Saindo do sistema...');
          this.rl.close();
          return;
        default:
          console.log('Opção inválida!');
      }
    }
  }

  iniciar(): void {
    if (fs.existsSync('alunos.csv')) {
      fs.unlinkSync('alunos.csv');
    }
    
    console.log('Bem-vindo ao Sistema Escolar!');
    this.menuPrincipal();
  }
}

const sistema = new SistemaEscolar();
sistema.iniciar();