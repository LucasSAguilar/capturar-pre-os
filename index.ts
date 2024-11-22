import puppeteer from "puppeteer";

async function buscarPrecoProduto(url: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);

  const classes_lojas = [
    {
      name: "Amazon",
      classe: ".a-offscreen",
    },
    {
      name: "Mercado Livre",
      classe: ".andes-money-amount__fraction",
    },
  ];
  let preco: string | undefined = undefined;
  let nome_loja: string | undefined;
  let i = 0;

  while (preco === undefined && i < classes_lojas.length) {
    try {
      nome_loja = classes_lojas[i].name;

      preco = await page.$eval(classes_lojas[i].classe, (element: any) => {
        return element ? element.innerText : null;
      });

      if (preco === null) {
        preco = undefined;
      }
    } catch (error) {
      console.log(`Erro ao tentar capturar preço da ${nome_loja}:`, error);
      preco = undefined;
    }

    i++;
  }

  if (preco) {
    console.log(`O preço encontrado em ${nome_loja} é: R$ ${preco}`);
  } else {
    console.log("Preço não encontrado em nenhuma loja.");
  }
  await browser.close();
}

buscarPrecoProduto(
    "https://www.amazon.com.br/TP-Link-ADAPTADOR-BLUETOOTH-UB500-Preto/dp/B098K3H92Z/ref=pd_sim_d_sccl_2_3/140-7262426-5909862?pd_rd_w=pWQzR&content-id=amzn1.sym.8555f615-361b-42f7-96c4-206bb8a5174e&pf_rd_p=8555f615-361b-42f7-96c4-206bb8a5174e&pf_rd_r=F2QVNPNVP4CY71N0TT1P&pd_rd_wg=2GrSm&pd_rd_r=e271943f-2a42-4614-95f4-64df2e4d658a&pd_rd_i=B098K3H92Z&psc=1"
).catch(console.error);
