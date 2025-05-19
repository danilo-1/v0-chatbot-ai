import { sql } from "@/lib/db"

async function main() {
  console.log("Testing database connection...")

  try {
    // Test basic connection
    const result = await sql`SELECT NOW() as time`
    console.log("✅ Connection successful!")
    console.log(`Server time: ${result[0].time}`)

    // Check tables
    console.log("\nChecking database tables...")
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    if (tables.length === 0) {
      console.log("⚠️ No tables found in the public schema")
    } else {
      console.log(`✅ Found ${tables.length} tables:`)
      tables.forEach((t, i) => {
        console.log(`${i + 1}. ${t.table_name}`)
      })
    }

    // Check GlobalConfig
    console.log("\nChecking GlobalConfig...")
    const globalConfig = await sql`SELECT * FROM "GlobalConfig" WHERE id = 'global'`

    if (globalConfig.length === 0) {
      console.log("⚠️ GlobalConfig not found")
    } else {
      console.log("✅ GlobalConfig found")
    }

    // Check AIModel
    console.log("\nChecking AIModel...")
    const aiModels = await sql`SELECT * FROM "AIModel"`

    if (aiModels.length === 0) {
      console.log("⚠️ No AI models found")
    } else {
      console.log(`✅ Found ${aiModels.length} AI models:`)
      aiModels.forEach((model, i) => {
        console.log(`${i + 1}. ${model.name} (${model.provider}/${model.modelid})`)
      })
    }
  } catch (error) {
    console.error("❌ Connection failed!")
    console.error("Error details:", error)

    // Check environment variables
    console.log("\nChecking environment variables...")
    const dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
      console.error("❌ DATABASE_URL is not set")
    } else {
      console.log("✅ DATABASE_URL is set")
      // Print a sanitized version of the URL
      try {
        const url = new URL(dbUrl)
        console.log(`Protocol: ${url.protocol}`)
        console.log(`Host: ${url.hostname}`)
        console.log(`Port: ${url.port}`)
        console.log(`Path: ${url.pathname}`)
        console.log(`Username: ${url.username ? "✅ Set" : "❌ Not set"}`)
        console.log(`Password: ${url.password ? "✅ Set" : "❌ Not set"}`)
      } catch (e) {
        console.error("❌ DATABASE_URL is not a valid URL")
      }
    }
  }
}

main()
  .catch(console.error)
  .finally(() => {
    console.log("\nDatabase connection check completed")
    process.exit(0)
  })
