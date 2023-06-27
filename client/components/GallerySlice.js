import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchGallery, removeImage, upload } from "./GalleryApi";

const byDateDesc = (a, b) => {
  return new Date(b.created_at) - new Date(a.created_at);
};

const initialState = {
  list: [],
  status: "idle",
  current: null,
  uplaodStatus: "idle",
};

export const loadGallery = createAsyncThunk(
  "gallery/fetchGallery",
  async (id) => {
    const gallery = await fetchGallery(id);
    const sorted = gallery.sort(byDateDesc);
    return sorted;
  }
);

export const uploadToGallery = createAsyncThunk(
  "gallery/uploadToGallery",
  async (image) => {
    let formData = new FormData();
    formData.append("files", image, new Date().toLocaleDateString() + ".png");
    const data = await upload(formData);
    return data;
  }
);

export const deleteImages = createAsyncThunk(
  "dealers/deleteDealer",
  async (imageIds = []) => {
    const response = [];
    for (let i = 0; i < imageIds.length; i++) {
      response[i] = await removeImage(imageIds[i]);
    }

    return response;
  }
);

export const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    setCurrent: (state, action) => {
      state.current = action.payload;
    },
    setNext: (state) => {
      const current = state.current;
      if (!current) {
        return;
      }

      let currentIndex = state.list.findIndex(
        (image) => image.id === current.id
      );
      const nextIndex =
        currentIndex === state.list.length - 1 ? 0 : currentIndex + 1;
      const nextImage = state.list[nextIndex];
      state.current = nextImage;
    },
    setPrevious: (state, action) => {
      const current = state.current;
      if (!current) {
        return;
      }

      let currentIndex = state.list.findIndex(
        (image) => image.id === current.id
      );
      const previousIndex =
        currentIndex === 0 ? state.list.length - 1 : currentIndex - 1;
      const previousImage = state.list[previousIndex];
      state.current = previousImage;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loadGallery.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadGallery.fulfilled, (state, action) => {
        state.status = "idle";
        state.list = action.payload.map((image, id) => ({ id, ...image }));
      });

    builder
      .addCase(uploadToGallery.pending, (state) => {
        state.uplaodStatus = "loading";
      })
      .addCase(uploadToGallery.fulfilled, (state, action) => {
        state.uplaodStatus = "idle";
      });

    builder
      .addCase(deleteImages.pending, (state) => {
        state.uploadStatus = "loading";
      })
      .addCase(deleteImages.fulfilled, (state, action) => {
        state.uploadStatus = "idle";
      });
  },
});

export const { setCurrent, setNext, setPrevious } = gallerySlice.actions;

export const selectGallery = (state) => state.gallery.list;
export const selectGalleryStatus = (state) => state.gallery.status;
export const selectGalleryUploadStatus = (state) =>
  state.gallery.uplaodStatus === "loading";
export const selectCurrent = (state) => state.gallery.current;
export const selectIsLoading = (state) => state.gallery.status === "loading";

const galleryReducer = gallerySlice.reducer;
export default galleryReducer;
