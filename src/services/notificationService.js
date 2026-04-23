import * as Notifications from 'expo-notifications';


export async function scheduleBillNotification(titulo, dataVencimento) {
  // dataVencimento vem como "YYYY-MM-DD"
  // Adicionamos o horário para garantir que o objeto Date seja criado corretamente
  const [year, month, day] = dataVencimento.split('-').map(Number);

  // Criamos a data do vencimento (9h da manhã)
  const vencimento = new Date(year, month - 1, day, 9, 0, 0);
  
  // Calculamos a data do alerta (2 dias antes)
  const dataAlerta = new Date(vencimento);
  dataAlerta.setDate(vencimento.getDate() - 2);

  const agora = new Date();

  try {
    // Se a data de alerta já passou (vencimento hoje ou amanhã)
    if (dataAlerta <= agora) {
      console.log("LOG: Data de alerta já passou. Agendando para 10 segundos.");
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "⚠️ Lembrete Imediato",
          body: `A conta "${titulo}" vence em breve!`,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.MAX,
        },
        trigger: {
          seconds: 10,
          channelId: 'default',
        },
      });
    } else {
      console.log("LOG: Agendando para data futura:", dataAlerta.toLocaleString());
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "⚠️ Lembrete de Conta",
          body: `A conta "${titulo}" vence em 2 dias!`,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.MAX,
        },
        trigger: {
          date: dataAlerta,
          channelId: 'default',
        },
      });
    }
  } catch (e) {
    console.error("Erro real no agendamento:", e);
    throw e;
  }
}

// Função para listar no console todas as notificações agendadas no celular
export async function listarNotificacoesAgendadas() {
  const agendadas = await Notifications.getAllScheduledNotificationsAsync();
  console.log("NOTIFICAÇÕES NA FILA DO ANDROID:");
  agendadas.forEach(notif => {
    console.log(`- Conta: ${notif.content.title} | Gatilho:`, notif.trigger);
  });
}