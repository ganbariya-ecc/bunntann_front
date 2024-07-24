    // タスクの表示
    const taskContainer = document.getElementById('task-container');

    // タスクの情報を表示
    function show_task_info(task){
        const taskDiv = document.createElement('div');
        taskDiv.className = 'flex items-center bg-orange-50 border-4 border-orange-50 mt-8 mb-14 w-auto h-36 rounded-3xl relative';

        const checkSpan = document.createElement('span')
        checkSpan.id = 'check_circle';
        checkSpan.className = `material-icons absolute left-20 rounded-full p-[5px] ${task.completed ? 'text-completed' : 'text-incomplete'}`;
        // どうしてもサイズが反映されない
        checkSpan.style = 'font-size: 80px;';
        checkSpan.textContent ='check_circle';
        checkSpan.classList.add(task.completed ? 'completed' : 'incomplete');

        const taskText = document.createElement('p');
        taskText.textContent = task.name;
        taskText.className = 'text-6xl text-center flex-grow mx-auto';
        
        taskDiv.appendChild(checkSpan);
        taskDiv.appendChild(taskText);
        taskContainer.appendChild(taskDiv);
        taskDiv.id = task.taskid;

        //押されれたときのイベント追加
        taskDiv.addEventListener("click", () => {
            window.location.href = `/statics/app/html/user/tasks/task_info.html?taskid=${task.taskid}`;
        })
    };

    //承認待機中のタスクを表示する
    const moreTaskContainer = document.getElementById('more-task-container');

    function Show_MoreTask(taskname, taskid){
        const taskDiv = document.createElement('div');
        taskDiv.className = 'flex items-center bg-orange-50 border-4 border-orange-50 mt-8 mb-14 w-auto h-36 rounded-3xl relative';

        const checkSpan = document.createElement('span');
        checkSpan.id = 'check_circle';
        checkSpan.className = `material-icons absolute left-20 rounded-full p-[5px] ${task.completed ? 'text-completed' : 'text-incomplete'}`;
        // どうしてもサイズが反映されない
        checkSpan.style = 'font-size: 80px;';
        checkSpan.textContent = 'check_circle';
        checkSpan.classList.add('incomplete');

        const taskText = document.createElement('p');
        taskText.textContent = taskname;
        taskText.className = 'text-6xl text-center flex-grow mx-auto';
        
        taskDiv.appendChild(checkSpan);
        taskDiv.appendChild(taskText);
        moreTaskContainer.appendChild(taskDiv);

        taskDiv.addEventListener("click", () => {
            window.location.href = `/statics/app/html/user/tasks/task_info.html?taskid=${taskid}`;
        })
    }
    async function Init() {
        // タスク一覧を取得
        const get_tasks = await GetTasks();
    
        console.log(get_tasks);
    
        //タスクを回す
        get_tasks.forEach(task => {
            const taskid = task["TaskID"];
            const status = task["Status"];
            const taskname = task["TaskName"];
    
            //タスクが完了しているか
            let completed = false;
    
            //タスクが終わっているか否か
            if (status == "Done") {
                completed = true;
            }
    
            console.log(status);
    
            console.log(completed);
    
            //タスクを表示する
            if (status == "Approval_Pending") {
                //承認待機中のタスクを表示する
                Show_MoreTask(taskname, taskid);
            } else {
                //終わっているかを逆にする
                show_task_info({ name: taskname, completed: !completed, taskid: taskid });
            }
        });
    
        //ロード画面を消す
        hideLoading();
    }
    
    showLoading();
    Init();