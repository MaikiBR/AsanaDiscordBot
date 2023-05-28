import { config } from 'dotenv';
import { ApplicationCommandOptionType, Client, GatewayIntentBits, Routes} from 'discord.js';
import { REST } from '@discordjs/rest';
import axios from 'axios';

config();

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const LE_SECTION_GID = process.env.GID_LISTAESPERA;
const OP_SECTION_GID = process.env.GID_ENPROCESO;
const NR_SECTION_GID = process.env.GID_REQUERIMIENTOS;

const GID_IVAN = process.env.GID_IVAN;
const GID_MIKE = process.env.GID_MIKE;
const GID_CANO = process.env.GID_CANO;
const GID_RIGO = process.env.GID_RIGO;


const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
})

const rest = new REST({ version: '10' }).setToken(TOKEN);

async function getOnProcessTasks() {
    const accessToken = process.env.ASANA_ACCESS_TOKEN;
    const sectionId = process.env.GID_ENPROCESO;

    try {
        // Tareas del proyecto
        const response = await axios.get(`https://app.asana.com/api/1.0/sections/${sectionId}/tasks`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
  
        const tasks = response.data.data;
        // console.log("tasks", tasks);
  
        return tasks;
    } catch (error) {
        console.error('Error al obtener las tareas en proceso:', error);
        return [];
    }
}

async function createTask(nombreTarea, projectId, sectionId, fechaEntrega, assigneeId) {
    const accessToken = process.env.ASANA_ACCESS_TOKEN;
    console.log(sectionId); 
  
    try {
        const response = await axios.post('https://app.asana.com/api/1.0/tasks', {
            data: {
                name: nombreTarea,
                projects: [projectId],
                section: [sectionId],
                due_on: fechaEntrega,
                assignee: assigneeId
            }
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    
        const taskCreated = response.data.data;
        return taskCreated;
    } catch (error) {
        console.error('Error al crear la tarea en Asana:', error);
        return null;
    }
} 

async function completeTask(taskId, projectId){

}

client.on('ready', () => {
    console.log(`${client.user.username} has logged in!`);
});

// client.on('interactionCreate', (interaction) => {
//     if (interaction.isChatInputCommand()) {
//         console.log("Hello World!");
//         console.log(interaction.options.getString('op1'));
//         interaction.reply({ content: "Commands working!" });
//     }
// });

client.on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand() && interaction.commandName === 'tareas') {
        const tasks = await getOnProcessTasks();
        // console.log(tasks);
  
        const response = tasks.map((task) => `🔹 ${task.name}`).join('\n');
  
        interaction.reply(`🔴 Tareas en proceso:\n\n${response}`);
        // console.log(response);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand() && interaction.commandName === 'crear-tarea') {
        const task = interaction.options.getString('nombre-tarea');
        const projectId = process.env.ID_PROYECTO_ASANA;
        const sectionId = interaction.options.getString('seccion');
        const fechaEntrega = interaction.options.getString('fecha-entrega');
        const assigneeId = interaction.options.getString('responsable'); 
        const taskCreated = await createTask(task, projectId, sectionId, fechaEntrega, assigneeId);

        // console.log(taskCreated);

        if (taskCreated) {
            interaction.reply(
                "🔴 Tarea creada exitosamente: " + taskCreated.name + "\n\n" +
                "📅 " + "Fecha de Entrega: " + taskCreated.due_on + "\n" +
                "👤 " + "Responsable: " + taskCreated.assignee.name
                );
        }else{
            interaction.reply('Ocurrió un error al crear la tarea. ❌')
        }
    }
}); 

async function main() {
    const commands = [
        {
            name: 'testcommand',
            description: 'Test command',
            options: [{
                name: "op1",
                description: "first option",
                type: 3,
                required: true,
            }],
        },
        {
            name: 'tareas',
            description: 'Ver todas las tareas en proceso.'
        },
        {
            name: 'crear-tarea',
            description: 'Ingresa nombre, selecciona sección, ingresa fecha de entrega (A-M-D), selecciona responsable.',
            options: [
                {
                    name: 'nombre-tarea',
                    description: 'Nombre de la tarea',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: 'seccion',
                    description: 'Seccion',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        {
                            name: 'Lista de Espera',
                            value: LE_SECTION_GID,
                        },
                        {
                            name: 'Nuevos Requerimientos',
                            value: NR_SECTION_GID,
                        },
                        {
                            name: 'En Proceso',
                            value: OP_SECTION_GID,
                        },
                    ]
                },
                {
                    name: 'fecha-entrega',
                    description: 'Fecha de entrega (en formato AÑO-MES-DÍA)',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: 'responsable',
                    description: 'Responsable',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        {
                            name: 'Miguel',
                            value: GID_MIKE,
                        },
                        {
                            name: 'Ivan',
                            value: GID_IVAN,
                        },
                        {
                            name: 'Rigo',
                            value: GID_RIGO,
                        },
                        {
                            name: 'Cano',
                            value: GID_CANO,
                        },
                    ]
                },
            ]
        }
    ];

    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
            body: commands, 
        });
        client.login(TOKEN);
    } catch (error) {
        console.log(error);
    }
}

main();

// client.on('messageCreate', (message) => {
//     console.log(message.content, ":", message.author.username);
//     console.log(message.createdAt.toDateString());
// });