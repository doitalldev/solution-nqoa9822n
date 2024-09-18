const domain = process.env.DOMAIN;
const adminToken = process.env.ADMIN_TOKEN;


// Parse nodejs args
let args = {};
process.argv.slice(2).forEach((arg) => {
  if (arg.startsWith("--")) {
    const [key, value] = arg.slice(2).split("=");
    if (value === undefined) {
      const nextArg = process.argv[process.argv.indexOf(arg) + 1];
      args[key] = nextArg && !nextArg.startsWith("--") ? nextArg : true;
    } else {
      args[key] = value;
    }
  }
});

// If args.name is not set, exit with error
if (!args?.name) {
  console.log("Please provide a name argument");
  process.exit(1);
}

// Request sent to store
async function getProductsByName(storefrontToken, name) {
  const body = JSON.stringify({
    query: GetProductsQuery,
    variables: {
      query: `title:*${name}*`,
    },
  });

  try {
    const response = await fetch(`${domain}/admin/api/2024-07/graphql.json`, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": storefrontToken,
        "Content-Type": "application/json",
      },
      body: body,
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error);
  }
}

// Graphql Query
const GetProductsQuery = `
query ($query: String) {
  products(first: 100, query:$query) {
    nodes {
      title
      id
      variants(first: 100) {
        nodes {
          title
          price
        }
      }
    }
  }
}
`;

// Sort all product data by creating a new array of objects
// then sort the array by price and return the sorted array
const sortVariantsByPrice = (products) => {
  const newProducts = products.reduce((acc, product) => {
    product.variants.nodes.forEach((variant) => {
      acc.push({
        title: product.title,
        variantTitle: variant.title,
        price: variant.price,
      });
    });
    return acc;
  }, []);
  newProducts.sort((a, b) => a.price - b.price);
  return newProducts;
};

const run = async () => {
  // Get products by name
  const products = await getProductsByName(adminToken, args.name);
  if (products.errors) {
    console.log(products.errors);
    process.exit(1);
  }

  // Sort products by price
  const sortedProducts = sortVariantsByPrice(products.data.products.nodes);

  // Output requested data
  sortedProducts.forEach((product) => {
    console.log(`${product.title} - variant ${product.title} - price ${product.price}`);
  });
};

run();
