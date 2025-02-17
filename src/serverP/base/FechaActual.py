from datetime import datetime, timedelta

def obtener_fecha_actual():
    """Devuelve una condición SQL con la fecha actual."""
    hoy = datetime.now()
    fecha_inicio = hoy.strftime("%Y-%m-%d")

    mañana = hoy + timedelta(days=1)
    fecha_fin = mañana.strftime("%Y-%m-%d")

    return f"rd.fecha >= '{fecha_inicio}' AND rd.fecha < '{fecha_fin}'"

def generar_condicion_fecha(fecha_input):
    """Genera una condición SQL para una fecha específica."""
    try:
        hoy = datetime.strptime(fecha_input, "%Y-%m-%d")
    except ValueError:
        raise ValueError("Formato de fecha inválido. Usa 'YYYY-MM-DD'.")

    fecha_inicio = hoy.strftime("%Y-%m-%d")

    mañana = hoy + timedelta(days=1)
    fecha_fin = mañana.strftime("%Y-%m-%d")

    return f"Fecha >= '{fecha_inicio}' AND Fecha < '{fecha_fin}'"

# Pruebas si se ejecuta como script
if __name__ == "__main__":
    print(obtener_fecha_actual())
    print(generar_condicion_fecha("2025-02-15"))
