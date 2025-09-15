const bcrypt = require("bcrypt");
const { connect, closeConnection } = require("../database/connection");
const sql = require("mssql");

module.exports = {
  // cadastra carros (Post)
  async cadastrarCars(request, response) {
    let pool;
    try {
      const {
        model,
        year,
        price,
        transmission,
        mileage,
        fuelType,
        tax,
        mpg,
        engineSize,
        Manufacturer,
      } = request.body;

      if (
        !model ||
        !year ||
        !price ||
        !transmission ||
        !mileage ||
        !fuelType ||
        !tax ||
        !mpg ||
        !engineSize ||
        !Manufacturer
      ) {
        return response.status(400).json({
          sucesso: false,
          mensagem:
            "model, year, price, transmission, mileage, fuelType, tax, mpg, engineSize e Manufacturer são obrigatórios.",
          dados: null,
        });
      }

      pool = await connect();

      const query = `
        INSERT INTO Cars (model, year, price, transmission, mileage, fuelType, tax, mpg, engineSize, Manufacturer)
        OUTPUT INSERTED.id
        VALUES (@model, @year, @price, @transmission, @mileage, @fuelType, @tax, @mpg, @engineSize, @Manufacturer);
      `;

      const result = await pool
        .request()
        .input("model", sql.NVarChar, model)
        .input("year", sql.Int, year)
        .input("price", sql.Int, price)
        .input("transmission", sql.NVarChar, transmission)
        .input("mileage", sql.Int, mileage)
        .input("fuelType", sql.NVarChar, fuelType)
        .input("tax", sql.Int, tax)
        .input("mpg", sql.Float, mpg)
        .input("engineSize", sql.Float, engineSize)
        .input("Manufacturer", sql.NVarChar, Manufacturer)
        .query(query);

      const carsId = result.recordset[0].id;

      return response.status(200).json({
        sucesso: true,
        mensagem: "Cars cadastrado com sucesso.",
        dados: { carsId },
      });
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);

      return response.status(500).json({
        sucesso: false,
        mensagem: "Erro na requisição.",
        dados: error.message,
      });
    } finally {
      if (pool) {
        await closeConnection(pool);
      }
    }
  },

  // Listar todos os carros (GET)
  async listarCars(request, response) {
    let pool;
    try {
      pool = await connect();

      const query = "SELECT * FROM Cars";

      const result = await pool.request().query(query);

      return response.status(200).json({
        sucesso: true,
        mensagem: "Lista de carros recuperada com sucesso.",
        dados: result.recordset,
      });
    } catch (error) {
      console.error("Erro ao listar carros:", error);

      return response.status(500).json({
        sucesso: false,
        mensagem: "Erro ao buscar a lista de carros.",
        dados: error.message,
      });
    } finally {
      if (pool) {
        await closeConnection(pool);
      }
    }
  },
  // Listar todos os carros (GET) com id
  async listarCarsId(request, response) {
    let pool;
    try {
      const { id } = request.params;

      if (!id) {
        return response.status(400).json({
          sucesso: false,
          mensagem: "O ID do carro é obrigatório.",
        });
      }

      pool = await connect();

      const query = "SELECT * FROM Cars WHERE id = @id";

      const result = await pool.request().input("id", sql.Int, id).query(query);

      const car = result.recordset[0];

      if (!car) {
        return response.status(404).json({
          sucesso: false,
          mensagem: "Carro não encontrado.",
        });
      }

      return response.status(200).json({
        sucesso: true,
        mensagem: "Carro recuperado com sucesso.",
        dados: car,
      });
    } catch (error) {
      console.error("Erro ao buscar o carro por ID:", error);

      return response.status(500).json({
        sucesso: false,
        mensagem: "Erro ao buscar o carro.",
        dados: error.message,
      });
    } finally {
      if (pool) {
        await closeConnection(pool);
      }
    }
  },
  // Atualizar um carro existente (put)
  async atualizarCars(request, response) {
    let pool;
    try {
      const { id } = request.params; // Obtém o ID da URL
      const {
        model,
        year,
        price,
        transmission,
        mileage,
        fuelType,
        tax,
        mpg,
        engineSize,
        Manufacturer,
      } = request.body; // Obtém os dados do corpo da requisição

      // Verificação de campos obrigatórios
      if (
        !model ||
        !year ||
        !price ||
        !transmission ||
        !mileage ||
        !fuelType ||
        !tax ||
        !mpg ||
        !engineSize ||
        !Manufacturer
      ) {
        return response.status(400).json({
          sucesso: false,
          mensagem:
            "Todos os campos do carro são obrigatórios para a atualização.",
        });
      }

      pool = await connect();

      // Consulta para atualizar o carro com base no ID
      const query = `
      UPDATE Cars
      SET 
        model = @model, 
        year = @year, 
        price = @price, 
        transmission = @transmission, 
        mileage = @mileage, 
        fuelType = @fuelType, 
        tax = @tax, 
        mpg = @mpg, 
        engineSize = @engineSize, 
        Manufacturer = @Manufacturer
      WHERE id = @id;
    `;

      const result = await pool
        .request()
        .input("id", sql.Int, id)
        .input("model", sql.NVarChar, model)
        .input("year", sql.Int, year)
        .input("price", sql.Int, price)
        .input("transmission", sql.NVarChar, transmission)
        .input("mileage", sql.Int, mileage)
        .input("fuelType", sql.NVarChar, fuelType)
        .input("tax", sql.Int, tax)
        .input("mpg", sql.Float, mpg)
        .input("engineSize", sql.Float, engineSize)
        .input("Manufacturer", sql.NVarChar, Manufacturer)
        .query(query);

      // Verifica se alguma linha foi afetada pela atualização
      if (result.rowsAffected[0] === 0) {
        return response.status(404).json({
          sucesso: false,
          mensagem: "Carro não encontrado para atualização.",
        });
      }

      return response.status(200).json({
        sucesso: true,
        mensagem: "Carro atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar o carro:", error);
      return response.status(500).json({
        sucesso: false,
        mensagem: "Erro na requisição.",
        dados: error.message,
      });
    } finally {
      if (pool) {
        await closeConnection(pool);
      }
    }
  },
  // Deletar um carro (delete)
  async deletarCars(request, response) {
    let pool;
    try {
      const { id } = request.params; // Obtém o ID da URL

      if (!id) {
        return response.status(400).json({
          sucesso: false,
          mensagem: "O ID do carro é obrigatório para a exclusão.",
        });
      }

      pool = await connect();

      // Consulta para deletar o carro com base no ID
      const query = `DELETE FROM Cars WHERE id = @id;`;

      const result = await pool.request().input("id", sql.Int, id).query(query);

      // Verifica se alguma linha foi afetada pela exclusão
      if (result.rowsAffected[0] === 0) {
        return response.status(404).json({
          sucesso: false,
          mensagem: "Carro não encontrado para exclusão.",
        });
      }

      return response.status(200).json({
        sucesso: true,
        mensagem: "Carro excluído com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao deletar o carro:", error);
      return response.status(500).json({
        sucesso: false,
        mensagem: "Erro na requisição.",
        dados: error.message,
      });
    } finally {
      if (pool) {
        await closeConnection(pool);
      }
    }
  },
};
