const errorHandler = (err, req, res, next) => {

    console.error(err)

    if (err.code === "23505") {
        return res.status(409).json({
            message: "Já existe um veículo com essa placa."
        })
    }

    
    if (err.code === "23514") {
        return res.status(400).json({
            message: "Os dados informados são inválidos."
        })
    }

    res.status(err.status || 500).json({
        message: err.message || "Erro interno do servidor."
    })
}

export default errorHandler