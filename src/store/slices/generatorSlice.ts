import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { GeneratorState, Generator, GeneratorFilter } from '../../types';
import { productStorageService } from '../../services/productStorage.service';

const initialState: GeneratorState = {
  items: [],
  generators: [],
  selectedGenerator: null,
  isLoading: false,
  error: null,
  filter: {},
};

export const fetchGenerators = createAsyncThunk(
  'generators/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const generators = productStorageService.getGenerators();
      return generators;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchGeneratorById = createAsyncThunk(
  'generators/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const generators = productStorageService.getGenerators();
      const generator = generators.find((g) => g.id === id);
      if (!generator) {
        throw new Error('Generator not found');
      }
      return generator;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const saveGeneratorAsync = createAsyncThunk(
  'generators/save',
  async (generator: Generator, { rejectWithValue }) => {
    try {
      const saved = await productStorageService.saveGenerator(generator);
      return saved;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteGeneratorAsync = createAsyncThunk(
  'generators/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await productStorageService.deleteGenerator(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const generatorSlice = createSlice({
  name: 'generators',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<GeneratorFilter>) => {
      state.filter = action.payload;
    },
    clearFilter: (state) => {
      state.filter = {};
    },
    selectGenerator: (state, action: PayloadAction<Generator | null>) => {
      state.selectedGenerator = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchGenerators.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGenerators.fulfilled, (state, action: PayloadAction<Generator[]>) => {
        state.isLoading = false;
        state.items = action.payload;
        state.generators = action.payload;
      })
      .addCase(fetchGenerators.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch by ID
      .addCase(fetchGeneratorById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGeneratorById.fulfilled, (state, action: PayloadAction<Generator>) => {
        state.isLoading = false;
        state.selectedGenerator = action.payload;
      })
      .addCase(fetchGeneratorById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Save Generator
      .addCase(saveGeneratorAsync.fulfilled, (state, action: PayloadAction<Generator>) => {
        const index = state.generators.findIndex((g) => g.id === action.payload.id);
        if (index >= 0) {
          state.generators[index] = action.payload;
          state.items[index] = action.payload;
        } else {
          state.generators.unshift(action.payload);
          state.items.unshift(action.payload);
        }
      })
      // Delete Generator
      .addCase(deleteGeneratorAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.generators = state.generators.filter((g) => g.id !== action.payload);
        state.items = state.items.filter((g) => g.id !== action.payload);
      });
  },
});

export const { setFilter, clearFilter, selectGenerator } = generatorSlice.actions;
export default generatorSlice.reducer;
