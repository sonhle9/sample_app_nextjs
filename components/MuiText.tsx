import { InputAdornment, Stack, TextField } from '@mui/material';
import { useState } from 'react'

export const MuiText: React.FC<{}> = () => {
  const [value, setVAlue] = useState('')
  return (
    <Stack spacing={4}>
      <Stack direction='row' spacing={2}>
        <TextField label='Name' variant='outlined'/>
        <TextField label='Name' variant='filled'/>
        <TextField label='Name' variant='standard'/>
      </Stack>
      <Stack direction='row' spacing={2}>
        <TextField label='Small secondary' size='small' color='secondary' />
      </Stack>
      <Stack direction='row' spacing={2}>
        <TextField label='Form Input' size='small' color='secondary' />
        <TextField label='Form Input' required value={value} onChange={e => setVAlue(e.target.value)} error={!value} helperText={!value ? 'Required': 'Do not share your password with anyone'}/>
        <TextField label='Form Input' helperText='Do not share your password with anyone' />
        <TextField label='Password' type='password' helperText='Do not share your password with anyone' disabled/>
        <TextField label='Read only' InputProps={{ readOnly: true }} />
      </Stack>
      <Stack direction='row' spacing={2}>
        <TextField label='Amount' InputProps={{
          startAdornment: <InputAdornment position='start'>$</InputAdornment>
        }}/>
        <TextField label='Weight' InputProps={{
          startAdornment: <InputAdornment position='end'>kg</InputAdornment>
        }}/>
      </Stack>
    </Stack>
  )
}