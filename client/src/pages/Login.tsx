import { Box, Button, FormField, Spinner, TextInput } from 'grommet'
import { Phone, Send, User } from 'grommet-icons'
import React from 'react'
import { SubmitHandler, useForm } from "react-hook-form"
import { __api__ } from '../constants/endpoint'
import { ResponseLogin } from '../types/responses'
import { errorsToString } from '../utils/forms'

interface IFormData {
  phone: string
  name: string
}

export const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<IFormData>()

  const onSubmit: SubmitHandler<IFormData> = async ({ phone, name }) => {
    const response = await fetch(`${__api__}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phone, name })
    })
    if(response.ok) {
      const { token } = await response.json() as ResponseLogin
      localStorage.setItem('token', token)
      window.location.href = '/'
    }
  }

  return (
    <>
      <Box
        pad="medium"
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        animation={['fadeIn', 'slideUp']}
        width="large"
        background="white"
        elevation="medium"
        justify='center'
        align='center'
        gap="medium"
        style={{ position: 'relative' }}
      >
        {isSubmitting && (
          <Box
            style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
            background="rgba(0,0,0,0.2)"
            align="center"
            justify="center"
            animation="fadeIn"
          >
            <Spinner size="large" />
          </Box>
        )}

        <FormField
          label="Nafn"
          fill="horizontal"
          error={errorsToString([
              errors.name?.type === 'required' && 'required',
              errors.name?.type === 'minLength' && 'min length: 3',
              errors.name?.type === 'maxLength' && 'min length: 180'
            ])
          }
        >
          <TextInput
            {...register("name", {
              required: true,
              maxLength: 120
            })}
            icon={<User />}
            type="text"
            placeholder="Nafn"
          />
        </FormField>

        <Box direction="row" fill="horizontal" align='end' gap="small">
          <FormField
            label=""
            fill="horizontal"
            style={{ width: '120px' }}
            error={errors.phone && '_'}
          >
            <TextInput
              type="text"
              placeholder=""
              value="+354"
              disabled
            />
          </FormField>

          <FormField
            label="Simanumer"
            fill="horizontal"
            error={errorsToString([
              errors.phone?.type === 'required' && 'required',
              errors.phone?.type === 'minLength' && 'invalid phone number',
              errors.phone?.type === 'maxLength' && 'invalid phone number'
            ])}
          >
              <TextInput
                {...register("phone", {
                  required: true,
                  minLength: 7,
                  maxLength: 7,
                })}
                icon={<Phone />}
                type="tel"
                placeholder="Simanumer"
              />
          </FormField>
        </Box>

        <Box
          direction="row"
          fill="horizontal"
          justify="end"
        >
          <Button
            icon={<Send />}
            primary
            label="Senda koda"
            type="submit"
            size="small"
            disabled={isSubmitting}
          />
        </Box>
      </Box>
    </>
  )
}
