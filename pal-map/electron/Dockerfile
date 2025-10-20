FROM electronuserland/builder:wine

WORKDIR /electron

COPY package*.json ./
RUN npm install

COPY . .

CMD ["bash"]