import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const initialState = {
    tasks: [],
    loading: false,
    error: null,
    formData: { title: '', description: '', status: 'pending' },
    editingTask: null,
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get('/tasks');
        return res.data.tasks;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to fetch tasks.');
    }
});

export const addTask = createAsyncThunk('tasks/addTask', async (taskData, { rejectWithValue }) => {
    try {
        const res = await axios.post('/tasks', taskData);
        return res.data.task;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Operation failed.');
    }
});

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, data }, { rejectWithValue }) => {
    try {
        const res = await axios.put(`/tasks/${id}`, data);
        return res.data.task;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Operation failed.');
    }
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`/tasks/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to delete task.');
    }
});

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setForm(state, action) {
            const { name, value } = action.payload;
            state.formData[name] = value;
            state.error = null;
        },
        resetForm(state) {
            state.formData = { title: '', description: '', status: 'pending' };
            state.editingTask = null;
            state.error = null;
        },
        startEdit(state, action) {
            state.editingTask = action.payload;
            state.formData = { title: action.payload.title, description: action.payload.description || '', status: action.payload.status };
            state.error = null;
        },
        cancelEdit(state) {
            state.editingTask = null;
            state.formData = { title: '', description: '', status: 'pending' };
            state.error = null;
        },
        setError(state, action) {
            state.error = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetch
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch tasks.';
            })

            // add
            .addCase(addTask.pending, (state) => {
                state.error = null;
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.tasks.unshift(action.payload);
            })
            .addCase(addTask.rejected, (state, action) => {
                state.error = action.payload || 'Operation failed.';
            })

            // update
            .addCase(updateTask.pending, (state) => {
                state.error = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.map((t) => (t.id === action.payload.id ? action.payload : t));
                state.editingTask = null;
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.error = action.payload || 'Operation failed.';
            })

            // delete
            .addCase(deleteTask.pending, (state) => {
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter((t) => t.id !== action.payload);
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.error = action.payload || 'Failed to delete task.';
            });
    }
});

export const { setForm, resetForm, startEdit, cancelEdit, setError } = tasksSlice.actions;
export default tasksSlice.reducer;